"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateProfile, addSavedAddress, deleteSavedAddress } from "@/actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profileSchema, savedAddressSchema, type ProfileInput, type SavedAddressInput } from "@/lib/validations";

interface ProfilePageClientProps {
  profile: {
    name: string;
    email: string;
    phone: string | null;
    defaultAddress: string | null;
    emailVerified: Date | null;
    savedAddresses: Array<{
      id: string;
      label: string;
      address: string;
      isDefault: boolean;
    }>;
  };
}

export function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const [isPending, startTransition] = useTransition();

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone ?? "",
      defaultAddress: profile.defaultAddress ?? "",
    },
  });

  const addressForm = useForm<SavedAddressInput>({
    resolver: zodResolver(savedAddressSchema),
    defaultValues: { label: "", address: "", isDefault: false },
  });

  function onProfileSubmit(data: ProfileInput) {
    startTransition(async () => {
      const result = await updateProfile(data);
      if (result.error) toast.error(result.error);
      else toast.success("Profil diperbarui");
    });
  }

  function onAddressSubmit(data: SavedAddressInput) {
    startTransition(async () => {
      const result = await addSavedAddress(data);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Alamat ditambahkan");
        addressForm.reset();
      }
    });
  }

  function handleDeleteAddress(id: string) {
    startTransition(async () => {
      await deleteSavedAddress(id);
      toast.success("Alamat dihapus");
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Profil Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} disabled />
              {!profile.emailVerified && (
                <p className="text-xs text-amber-600">Email belum diverifikasi</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" {...profileForm.register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" {...profileForm.register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultAddress">Alamat Default</Label>
              <Input id="defaultAddress" {...profileForm.register("defaultAddress")} />
            </div>
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-brand-dark">
              Simpan Profil
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Alamat Tersimpan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.savedAddresses.map((address) => (
            <div key={address.id} className="flex items-start justify-between rounded-xl bg-muted/40 p-3">
              <div>
                <p className="font-medium">{address.label}</p>
                <p className="text-sm text-slate-500">{address.address}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id)}>
                Hapus
              </Button>
            </div>
          ))}

          <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-3 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label Alamat</Label>
              <Input id="label" placeholder="Rumah / Kantor" {...addressForm.register("label")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input id="address" {...addressForm.register("address")} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...addressForm.register("isDefault")} />
              Jadikan alamat default
            </label>
            <Button type="submit" variant="outline" disabled={isPending}>
              Tambah Alamat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
