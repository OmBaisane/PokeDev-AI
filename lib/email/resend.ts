import "server-only";

import { Resend } from "resend";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Resend email configuration is missing.");
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[Resend] Email delivery failed:", {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });

      throw new Error("Resend rejected the email request.");
    }

    if (!data?.id) {
      throw new Error("Resend did not return an email ID.");
    }

    console.log("[Resend] Email accepted:", {
      emailId: data.id,
    });
  } catch (error) {
    console.error("[Resend] Request exception:", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown error",
    });

    throw new Error("Email delivery failed.");
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationUrl: string,
): Promise<void> {
  await sendEmail(
    email,
    "Verify your PokeDev AI account",
    `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
        <h2>Welcome to PokeDev AI, ${escapeHtml(name)}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${escapeHtml(verificationUrl)}"
          style="display:inline-block;padding:12px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;">
          Verify Email
        </a>
        <p>This verification link is valid for 24 hours.</p>
        <p>If you didn't create this account, you can ignore this email.</p>
      </div>
    `,
  );
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string,
): Promise<void> {
  await sendEmail(
    email,
    "Reset your PokeDev AI password",
    `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
        <h2>Password reset request</h2>
        <p>Hello ${escapeHtml(name)},</p>
        <p>We received a request to reset your PokeDev AI password.</p>
        <a href="${escapeHtml(resetUrl)}"
          style="display:inline-block;padding:12px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  );
}
