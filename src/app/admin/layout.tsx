import { signOut } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar signOutAction={handleSignOut} />
      <div className="flex-1">
        <header className="border-b bg-white px-6 py-4 dark:bg-slate-950 md:hidden">
          <p className="font-bold text-slate-900 dark:text-white">MakanBang Admin</p>
        </header>
        <main className="p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      </div>
      <AdminMobileNav />
    </div>
  );
}
