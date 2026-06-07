import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { HeaderActions } from "@/components/customer/header-actions";
import { CustomerHeaderNav } from "@/components/customer/customer-header-nav";
import { getUnreadNotificationCount } from "@/actions/profile-actions";

export async function CustomerHeader() {
  const session = await auth();
  const notificationCount = session?.user
    ? await getUnreadNotificationCount()
    : 0;

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-brand-dark text-sm font-bold text-white shadow-md shadow-primary/20">
            MB
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold tracking-tight text-brand-dark">
              MakanBang
            </p>
            <p className="text-xs text-muted-foreground">
              Pemesanan online
            </p>
          </div>
        </Link>

        <CustomerHeaderNav />

        <div className="flex items-center gap-2">
          <HeaderActions
            notificationCount={notificationCount}
            isLoggedIn={!!session?.user}
          />

          {session?.user ? (
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="rounded-full text-sm">
                  {session.user.name.split(" ")[0]}
                </Button>
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm" className="rounded-full">
                    Admin
                  </Button>
                </Link>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="ghost" size="sm" type="submit" className="rounded-full">
                  Keluar
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="rounded-full bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark">
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
