import { z } from "zod";

// ── Auth Schemas ──────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(50, "Nama maksimal 50 karakter"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
    phone: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .max(15, "Nomor telepon maksimal 15 digit")
      .regex(/^[0-9+\- ]+$/, "Format nomor telepon tidak valid")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// ── Booking Schema ────────────────────────────────────

export const bookingSchema = z
  .object({
    serviceType: z.enum(["SELF_DRIVE", "WITH_DRIVER"]),
    pickupMethod: z.enum(["SELF_PICKUP", "DELIVERY"]),
    pickupAddress: z.string().optional(),
    deliveryPhone: z
      .string()
      .regex(/^[0-9+\- ]+$/, "Format nomor telepon tidak valid")
      .min(10, "Nomor telepon minimal 10 digit")
      .optional()
      .or(z.literal("")),
    paymentMethod: z.enum(["TRANSFER", "TUNAI"]),
    startDate: z
      .string()
      .min(1, "Tanggal mulai wajib diisi"),
    endDate: z
      .string()
      .min(1, "Tanggal selesai wajib diisi"),
    notes: z
      .string()
      .max(500, "Catatan maksimal 500 karakter")
      .optional()
      .or(z.literal("")),
    ktpFile: z
      .any()
      .optional(),
    paymentFile: z
      .any()
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "Tanggal selesai harus setelah tanggal mulai",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.pickupMethod === "DELIVERY" && !data.pickupAddress) {
        return false;
      }
      return true;
    },
    {
      message: "Alamat pengantaran wajib diisi jika memilih diantar",
      path: ["pickupAddress"],
    }
  )
  .refine(
    (data) => {
      if (data.pickupMethod === "DELIVERY" && !data.deliveryPhone) {
        return false;
      }
      return true;
    },
    {
      message: "Nomor HP wajib diisi jika memilih diantar",
      path: ["deliveryPhone"],
    }
  )
  .refine(
    (data) => {
      if (data.paymentMethod === "TRANSFER" && !data.paymentFile) {
        return false;
      }
      return true;
    },
    {
      message: "Bukti transfer wajib diupload jika memilih transfer",
      path: ["paymentFile"],
    }
  );

// ── Admin Car Schema ──────────────────────────────────

export const carSchema = z.object({
  name: z.string().min(2, "Nama mobil minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  transmission: z.string().min(1, "Pilih transmisi"),
  capacity: z.coerce.number().min(1, "Kapasitas minimal 1"),
  fuelType: z.string().min(1, "Pilih jenis bahan bakar"),
  year: z.coerce
    .number()
    .min(2000, "Tahun minimal 2000")
    .max(2030, "Tahun maksimal 2030"),
  color: z.string().optional().or(z.literal("")),
  priceSelfDrive: z.coerce.number().min(1, "Harga minimal 1"),
  priceWithDriver: z.coerce.number().optional().nullable(),
  imageUrl: z.string().min(1, "URL gambar wajib diisi"),
  description: z.string().optional().or(z.literal("")),
  facilities: z.string().optional(),
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE", "UNAVAILABLE"]),
});

// ── Rental Settings Schema ────────────────────────────

export const rentalSettingsSchema = z.object({
  rentalName: z.string().min(1, "Nama rental wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  openingHours: z.string().min(1, "Jam operasional wajib diisi"),
  phone1: z.string().min(1, "Nomor telepon 1 wajib diisi"),
  phone2: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  bankName: z.string().optional().or(z.literal("")),
  bankAccountNumber: z.string().optional().or(z.literal("")),
  bankAccountName: z.string().optional().or(z.literal("")),
});

// ── Types ─────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type CarInput = z.infer<typeof carSchema>;
export type RentalSettingsInput = z.infer<typeof rentalSettingsSchema>;
