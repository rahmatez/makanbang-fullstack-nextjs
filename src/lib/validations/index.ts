import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, "Alamat pengiriman minimal 10 karakter"),
  notes: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().optional(),
  defaultAddress: z.string().optional(),
});

export const savedAddressSchema = z.object({
  label: z.string().min(2, "Label minimal 2 karakter"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  isDefault: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const menuItemSchema = z.object({
  name: z.string().min(2, "Nama menu minimal 2 karakter"),
  description: z.string().optional(),
  price: z.coerce.number().min(1000, "Harga minimal Rp 1.000"),
  imageUrl: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  isAvailable: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const restaurantSettingsSchema = z.object({
  name: z.string().min(2),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:mm"),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:mm"),
  isOpen: z.boolean(),
  closedMessage: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SavedAddressInput = z.infer<typeof savedAddressSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
