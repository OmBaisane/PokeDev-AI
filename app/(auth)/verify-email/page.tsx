import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export const instant = false;

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return <VerifyEmailForm token={token} />;
}
