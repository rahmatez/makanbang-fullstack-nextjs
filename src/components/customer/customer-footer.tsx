import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

export function CustomerFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-brand-dark text-sm font-bold text-white">
                MB
              </div>
              <div>
                <p className="font-bold tracking-tight text-brand-dark">MakanBang</p>
                <p className="text-xs text-muted-foreground">Kuliner Nusantara</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sajian Indonesia autentik dengan kemasan praktis. Pesan online, nikmati di rumah.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Navigasi</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/orders" className="transition-colors hover:text-primary">
                  Pesanan Saya
                </Link>
              </li>
              <li>
                <Link href="/profile" className="transition-colors hover:text-primary">
                  Profil
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Kontak</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                Senin – Minggu, 08.00 – 22.00
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="https://wa.me/6281393834186"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  WhatsApp 0813 9383 4186
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} MakanBang · oleh{" "}
            <a
              href="https://github.com/rahmatez"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary transition-colors hover:text-brand-dark hover:underline"
            >
              rahmatez
            </a>
          </p>
          <p>Dibuat dengan ❤️ untuk pecinta kuliner Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
