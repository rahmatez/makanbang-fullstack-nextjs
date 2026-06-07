import { CustomerHeader } from "@/components/customer/customer-header";
import { CustomerFooter } from "@/components/customer/customer-footer";
import { BottomNav } from "@/components/customer/bottom-nav";
import { FloatingChatButton } from "@/components/customer/floating-chat-button";

export const dynamic = "force-dynamic";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mesh-bg flex min-h-screen flex-col">
      <CustomerHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-28 md:py-10 md:pb-14 lg:px-8">
        {children}
      </main>
      <CustomerFooter />
      <BottomNav />
      <FloatingChatButton />
    </div>
  );
}
