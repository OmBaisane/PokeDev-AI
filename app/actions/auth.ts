"use server";

import { cookies } from "next/headers";

import { connectToDatabase } from "@/lib/db/mongoose";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { generateSecureToken, hashToken } from "@/lib/auth/tokens";
import { authRateLimits } from "@/lib/auth/rate-limit";
import {
  createSessionCookie,
  deleteSessionCookie,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/email/resend";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

import { User } from "@/models/User";
import { Session } from "@/models/Session";
import { EmailVerificationToken } from "@/models/EmailVerificationToken";
import { PasswordResetToken } from "@/models/PasswordResetToken";

type AuthResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

type TransactionOutcome = "success" | "invalid" | "unable";

const GENERIC_RESET_MESSAGE =
  "If an account exists with that email, a password reset link has been sent.";

function getAppUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("Application URL is not configured.");
  }

  const url = new URL(appUrl);

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error("Invalid application URL configuration.");
  }

  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("Production application URL must use HTTPS.");
  }

  return url.origin;
}

// REGISTER

export async function registerUser(input: unknown): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check your details.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = parsed.data;

  let stage = "rate-limit";

  try {
    const rateLimit = await authRateLimits.register.limit(email);

    if (!rateLimit.success) {
      console.warn("[registerUser] Rate limit exceeded.");

      return {
        success: false,
        message: "Too many registration attempts. Please try again later.",
      };
    }

    stage = "database-connection";
    await connectToDatabase();

    stage = "existing-user-check";
    const existingUser = await User.exists({ email });

    if (existingUser) {
      console.warn("[registerUser] Existing user found.");

      return {
        success: false,
        message: "Unable to create account with these details.",
      };
    }

    stage = "password-hashing";
    const passwordHash = await hashPassword(password);

    stage = "user-creation";
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    stage = "verification-token-creation";
    const rawToken = generateSecureToken();

    await EmailVerificationToken.create({
      userId: user._id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    stage = "verification-email";
    const verificationUrl = new URL("/verify-email", getAppUrl());
    verificationUrl.searchParams.set("token", rawToken);

    await sendVerificationEmail(email, name, verificationUrl.toString());

    return {
      success: true,
      message: "Account created. Please check your email to verify it.",
    };
  } catch (error) {
    const errorCode =
      typeof error === "object" && error !== null && "code" in error
        ? error.code
        : undefined;

    console.error("[registerUser] Registration failed:", {
      stage,
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorCode,
    });

    return {
      success: false,
      message: "Unable to complete registration. Please try again.",
    };
  }
}

// VERIFY EMAIL

export async function verifyEmail(token: string): Promise<AuthResult> {
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    return {
      success: false,
      message: "Invalid or expired verification link.",
    };
  }

  try {
    const rateLimit = await authRateLimits.emailVerification.limit(
      hashToken(token),
    );

    if (!rateLimit.success) {
      return {
        success: false,
        message: "Too many attempts. Please try again later.",
      };
    }

    const db = await connectToDatabase();
    const dbSession = await db.startSession();

    let outcome: TransactionOutcome;

    try {
      outcome = await dbSession.withTransaction(
        async (): Promise<TransactionOutcome> => {
          const verificationToken = await EmailVerificationToken.findOne({
            tokenHash: hashToken(token),
            expiresAt: { $gt: new Date() },
          }).session(dbSession);

          if (!verificationToken) {
            return "invalid";
          }

          const userUpdate = await User.updateOne(
            {
              _id: verificationToken.userId,
              isActive: true,
              emailVerifiedAt: null,
            },
            {
              $set: { emailVerifiedAt: new Date() },
            },
            { session: dbSession },
          );

          if (userUpdate.modifiedCount !== 1) {
            return "unable";
          }

          await EmailVerificationToken.deleteOne(
            { _id: verificationToken._id },
            { session: dbSession },
          );

          return "success";
        },
      );
    } finally {
      await dbSession.endSession();
    }

    if (outcome === "success") {
      return {
        success: true,
        message: "Email verified successfully. You can now log in.",
      };
    }

    return {
      success: false,
      message:
        outcome === "invalid"
          ? "Invalid or expired verification link."
          : "Unable to verify this account.",
    };
  } catch {
    return {
      success: false,
      message: "Unable to verify your email. Please try again.",
    };
  }
}

// LOGIN

export async function loginUser(input: unknown): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const { email, password } = parsed.data;

  try {
    const rateLimit = await authRateLimits.login.limit(email);

    if (!rateLimit.success) {
      return {
        success: false,
        message: "Too many login attempts. Please try again later.",
      };
    }

    await connectToDatabase();

    const user = await User.findOne({
      email,
      isActive: true,
    }).select("+passwordHash");

    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    if (!user.emailVerifiedAt) {
      return {
        success: false,
        message: "Please verify your email before logging in.",
      };
    }

    const rawToken = generateSecureToken();

    await Session.create({
      userId: user._id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await createSessionCookie(rawToken);

    return {
      success: true,
      message: "Login successful.",
    };
  } catch {
    return {
      success: false,
      message: "Unable to log in. Please try again.",
    };
  }
}

// LOGOUT

export async function logoutUser(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await connectToDatabase();

      await Session.deleteOne({
        tokenHash: hashToken(token),
      });
    }
  } finally {
    await deleteSessionCookie();
  }
}

// FORGOT PASSWORD

export async function forgotPassword(input: unknown): Promise<AuthResult> {
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const { email } = parsed.data;

  try {
    const rateLimit = await authRateLimits.passwordReset.limit(email);

    if (!rateLimit.success) {
      return {
        success: true,
        message: GENERIC_RESET_MESSAGE,
      };
    }

    await connectToDatabase();

    const user = await User.findOne({
      email,
      isActive: true,
      emailVerifiedAt: { $ne: null },
    });

    if (!user) {
      return {
        success: true,
        message: GENERIC_RESET_MESSAGE,
      };
    }

    await PasswordResetToken.deleteMany({
      userId: user._id,
    });

    const rawToken = generateSecureToken();

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetUrl = new URL("/reset-password", getAppUrl());
    resetUrl.searchParams.set("token", rawToken);

    await sendPasswordResetEmail(user.email, user.name, resetUrl.toString());

    return {
      success: true,
      message: GENERIC_RESET_MESSAGE,
    };
  } catch {
    return {
      success: false,
      message: "Unable to process your request. Please try again.",
    };
  }
}

// RESET PASSWORD

export async function resetPassword(input: unknown): Promise<AuthResult> {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check your password details.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { token, password } = parsed.data;

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return {
      success: false,
      message: "Invalid or expired reset link.",
    };
  }

  try {
    const rateLimit = await authRateLimits.passwordReset.limit(
      hashToken(token),
    );

    if (!rateLimit.success) {
      return {
        success: false,
        message: "Too many attempts. Please try again later.",
      };
    }

    // Hash before consuming the token.
    const passwordHash = await hashPassword(password);

    const db = await connectToDatabase();
    const dbSession = await db.startSession();

    let outcome: TransactionOutcome;

    try {
      outcome = await dbSession.withTransaction(
        async (): Promise<TransactionOutcome> => {
          const resetToken = await PasswordResetToken.findOne({
            tokenHash: hashToken(token),
            expiresAt: { $gt: new Date() },
            usedAt: null,
          }).session(dbSession);

          if (!resetToken) {
            return "invalid";
          }

          const userUpdate = await User.updateOne(
            {
              _id: resetToken.userId,
              isActive: true,
            },
            {
              $set: { passwordHash },
            },
            { session: dbSession },
          );

          if (userUpdate.modifiedCount !== 1) {
            return "unable";
          }

          await PasswordResetToken.deleteOne(
            { _id: resetToken._id },
            { session: dbSession },
          );

          await PasswordResetToken.deleteMany(
            { userId: resetToken.userId },
            { session: dbSession },
          );

          // Revoke all existing sessions after password reset.
          await Session.deleteMany(
            { userId: resetToken.userId },
            { session: dbSession },
          );

          return "success";
        },
      );
    } finally {
      await dbSession.endSession();
    }

    if (outcome !== "success") {
      return {
        success: false,
        message:
          outcome === "invalid"
            ? "Invalid or expired reset link."
            : "Unable to reset this account's password.",
      };
    }

    // Clear the current browser's session cookie after transaction commits.
    await deleteSessionCookie();

    return {
      success: true,
      message: "Password reset successful. Please log in again.",
    };
  } catch {
    return {
      success: false,
      message: "Unable to reset your password. Please try again.",
    };
  }
}
