import { CheckoutForm } from "@/components/customer/checkout-form";
import { PageHeader } from "@/components/customer/page-header";
import { canBypassPayment, isMidtransConfigured } from "@/lib/midtrans";
import { getProfile } from "@/actions/profile-actions";

export default async function CheckoutPage() {
  const profile = await getProfile();
  const midtransReady = isMidtransConfigured();
  const devBypass = canBypassPayment();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Checkout"
        title="Pengiriman & Bayar"
        description="Lengkapi detail pengiriman dan selesaikan pembayaran"
      />
      {!midtransReady && devBypass && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3.5 text-sm text-amber-800 backdrop-blur-sm">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          Mode development: Midtrans belum dikonfigurasi. Pesanan akan langsung ditandai lunas.
        </div>
      )}
      <CheckoutForm
        defaultAddress={
          profile?.defaultAddress ??
          profile?.savedAddresses.find((a) => a.isDefault)?.address ??
          undefined
        }
      />
    </div>
  );
}
