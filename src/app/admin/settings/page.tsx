import { getRestaurantSettingsAdmin } from "@/actions/admin-actions";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";

export default async function AdminSettingsPage() {
  const settings = await getRestaurantSettingsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan Restoran</h1>
        <p className="text-slate-500">Atur jam operasional dan status buka/tutup</p>
      </div>
      <AdminSettingsForm
        settings={{
          ...settings,
          closedMessage: settings.closedMessage ?? undefined,
        }}
      />
    </div>
  );
}
