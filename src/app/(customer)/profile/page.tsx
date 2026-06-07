import { getProfile } from "@/actions/profile-actions";
import { ProfilePageClient } from "@/components/customer/profile-page-client";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="text-slate-500">Kelola data akun dan alamat pengiriman</p>
      </div>
      <ProfilePageClient profile={profile} />
    </div>
  );
}
