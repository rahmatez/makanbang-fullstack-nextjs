import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
