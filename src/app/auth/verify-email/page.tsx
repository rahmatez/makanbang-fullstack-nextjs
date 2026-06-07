import Link from "next/link";
import { verifyEmail } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center px-4">
        <div className="surface-card w-full max-w-md p-8 text-center">
          <p className="text-red-600">Token verifikasi tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const result = await verifyEmail(token);

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-4">
      <div className="surface-card w-full max-w-md p-8 text-center">
        {result.error ? (
          <p className="text-red-600">{result.error}</p>
        ) : (
          <>
            <p className="text-lg font-semibold text-emerald-600">
              Email berhasil diverifikasi!
            </p>
            <Link href="/auth/login" className="mt-6 inline-block">
              <Button className="rounded-xl bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark">
                Masuk Sekarang
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
