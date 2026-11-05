"use server";

import { z } from "zod";

import { connectToDatabase } from "@/lib/db/mongoose";
import { authRateLimits } from "@/lib/auth/rate-limit";
import { generateSecureToken, hashToken } from "@/lib/auth/tokens";
import { sendVerificationEmail } from "@/lib/email/resend";

import { User } from "@/models/User";
import { EmailVerificationToken } from "@/models/EmailVerificationToken";

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((email) => email.toLowerCase());

const GENERIC_MESSAGE =
  "If your account needs verification, a new verification email will be sent.";

function getAppUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("Application URL is not configured.");
  }

  const parsedUrl = new URL(appUrl);

  if (
    !["http:", "https:"].includes(parsedUrl.protocol) ||
    parsedUrl.username ||
    parsedUrl.password ||
    (process.env.NODE_ENV === "production" && parsedUrl.protocol !== "https:")
  ) {
    throw new Error("Invalid application URL configuration.");
  }

  return parsedUrl.origin;
}

export async function resendVerificationEmail(
  input: unknown,
): Promise<{ success: boolean; message: string }> {
  const parsed = emailSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const email = parsed.data;
  let stage = "rate-limit";

  try {
    const rateLimit = await authRateLimits.emailVerification.limit(email);

    if (!rateLimit.success) {
      return {
        success: true,
        message: GENERIC_MESSAGE,
      };
    }

    stage = "database-connection";
    await connectToDatabase();

    stage = "user-lookup";
    const user = await User.findOne({
      email,
      isActive: true,
      emailVerifiedAt: null,
    });

    if (!user) {
      return {
        success: true,
        message: GENERIC_MESSAGE,
      };
    }

    stage = "app-url-validation";
    const appUrl = getAppUrl();

    stage = "token-creation";
    const rawToken = generateSecureToken();

    const newToken = await EmailVerificationToken.create({
      userId: user._id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    stage = "email-delivery";
    const verificationUrl = new URL("/verify-email", appUrl);
    verificationUrl.searchParams.set("token", rawToken);

    await sendVerificationEmail(
      user.email,
      user.name,
      verificationUrl.toString(),
    );

    stage = "old-token-cleanup";
    await EmailVerificationToken.deleteMany({
      userId: user._id,
      _id: { $ne: newToken._id },
    });

    return {
      success: true,
      message: GENERIC_MESSAGE,
    };
  } catch (error) {
    console.error("[resendVerificationEmail] Failed:", {
      stage,
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    return {
      success: false,
      message: "Unable to process your request. Please try again later.",
    };
  }
}
