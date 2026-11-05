import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export const instant = false;

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-4 py-12 text-white">
      <VerifyEmailForm token={token} />
    </main>
  );
}
