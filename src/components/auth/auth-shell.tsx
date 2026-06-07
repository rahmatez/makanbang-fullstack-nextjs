import Link from "next/link";
import { ReactNode } from "react";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";

interface AuthShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="mesh-bg flex min-h-screen">
      <div className="relative hidden w-[45%] overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="hero-mesh absolute inset-0" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-sm font-bold backdrop-blur-sm">
              MB
            </div>
            <span className="text-xl font-semibold tracking-tight">MakanBang</span>
          </Link>

          <div className="max-w-md space-y-6">
            <div>
              <p className="text-sm font-medium text-white/70">Selamat datang kembali</p>
              <h2 className="mt-2 text-4xl font-bold leading-tight tracking-tight">
                Rasa Nusantara,
                <br />
                pesan dalam hitungan menit.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="chip">
                <Sparkles className="h-3.5 w-3.5" />
                Menu segar setiap hari
              </span>
              <span className="chip">
                <Clock className="h-3.5 w-3.5" />
                Antar cepat
              </span>
              <span className="chip">
                <ShieldCheck className="h-3.5 w-3.5" />
                Pembayaran aman
              </span>
            </div>
          </div>

          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} MakanBang
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 text-center lg:hidden">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/25">
              MB
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-dark">MakanBang</span>
          </Link>
        </div>

        {(title || subtitle) && (
          <div className="mb-6 max-w-md text-center lg:hidden">
            {title && <h1 className="text-2xl font-bold tracking-tight text-brand-dark">{title}</h1>}
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
