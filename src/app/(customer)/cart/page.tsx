import { CartPageClient } from "@/components/customer/checkout-form";
import { PageHeader } from "@/components/customer/page-header";

export default function CartPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Belanja"
        title="Keranjang"
        description="Review pesanan sebelum checkout"
      />
      <CartPageClient />
    </div>
  );
}
