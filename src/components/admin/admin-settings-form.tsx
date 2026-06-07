"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateRestaurantSettings } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { restaurantSettingsSchema } from "@/lib/validations";
import { z } from "zod";

type SettingsForm = z.infer<typeof restaurantSettingsSchema>;

interface AdminSettingsFormProps {
  settings: SettingsForm;
}

export function AdminSettingsForm({ settings }: AdminSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit } = useForm<SettingsForm>({
    resolver: zodResolver(restaurantSettingsSchema),
    defaultValues: settings,
  });

  function onSubmit(data: SettingsForm) {
    startTransition(async () => {
      const result = await updateRestaurantSettings(data);
      if (result.error) toast.error(result.error);
      else toast.success("Pengaturan disimpan");
    });
  }

  return (
    <Card className="max-w-xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Jam Operasional & Status Restoran</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Restoran</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openTime">Buka</Label>
              <Input id="openTime" type="time" {...register("openTime")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeTime">Tutup</Label>
              <Input id="closeTime" type="time" {...register("closeTime")} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isOpen")} />
            Restoran buka (manual override)
          </label>
          <div className="space-y-2">
            <Label htmlFor="closedMessage">Pesan saat tutup</Label>
            <Input id="closedMessage" placeholder="Restoran sedang tutup" {...register("closedMessage")} />
          </div>
          <Button type="submit" disabled={isPending} className="bg-primary hover:bg-brand-dark">
            Simpan Pengaturan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
