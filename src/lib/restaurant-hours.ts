import { prisma } from "@/lib/prisma";

export async function getRestaurantSettings() {
  return prisma.restaurantSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {},
  });
}

export function isWithinOperatingHours(
  openTime: string,
  closeTime: string,
  now = new Date(),
): boolean {
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (openMinutes <= closeMinutes) {
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }

  return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
}

export async function isRestaurantOpen() {
  const settings = await getRestaurantSettings();
  if (!settings.isOpen) return { open: false, settings, reason: settings.closedMessage ?? "Restoran sedang tutup" };
  const withinHours = isWithinOperatingHours(settings.openTime, settings.closeTime);
  if (!withinHours) {
    return {
      open: false,
      settings,
      reason: `Jam operasional: ${settings.openTime} - ${settings.closeTime}`,
    };
  }
  return { open: true, settings };
}
