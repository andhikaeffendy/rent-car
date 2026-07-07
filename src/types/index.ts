export type UserRole = "CUSTOMER" | "ADMIN";
export type CarStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE" | "UNAVAILABLE";
export type BookingStatus =
  | "WAITING_PAYMENT"
  | "WAITING_VERIFICATION"
  | "CONFIRMED"
  | "REJECTED"
  | "ON_RENT"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "WAITING" | "VERIFIED" | "REJECTED";
export type ServiceType = "SELF_DRIVE" | "WITH_DRIVER";
export type PickupMethod = "SELF_PICKUP" | "DELIVERY";
export type VehicleType = "MOBIL" | "MOTOR";
export type PaymentMethod = "TRANSFER" | "TUNAI";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}

export interface Car {
  id: string;
  name: string;
  slug: string;
  transmission: string;
  capacity: number;
  fuelType: string;
  type: VehicleType;
  year: number;
  color: string | null;
  priceSelfDrive: number;
  priceWithDriver: number | null;
  imageUrl: string;
  galleryUrls: string[];
  status: CarStatus;
  description: string | null;
  facilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string | null;
  carId: string;
  car?: Car;
  user?: User;
  serviceType: ServiceType;
  pickupMethod: PickupMethod;
  pickupAddress: string | null;
  deliveryPhone: string | null;
  paymentMethod: PaymentMethod;
  startDate: string;
  endDate: string;
  duration: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  notes: string | null;
  status: BookingStatus;
  payments?: Payment[];
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  transferProofUrl: string;
  status: PaymentStatus;
  verifiedAt: string | null;
  createdAt: string;
}

export interface Document {
  id: string;
  bookingId: string;
  ktpUrl: string;
  createdAt: string;
}

export interface RentalSetting {
  id: string;
  rentalName: string;
  address: string;
  openingHours: string;
  phone1: string;
  phone2: string;
  instagram: string;
  facebook: string;
  logoUrl: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
}

// Status display labels
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  WAITING_PAYMENT: "Menunggu Pembayaran",
  WAITING_VERIFICATION: "Menunggu Verifikasi",
  CONFIRMED: "Dikonfirmasi",
  REJECTED: "Ditolak",
  ON_RENT: "Sedang Disewa",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const CAR_STATUS_LABELS: Record<CarStatus, string> = {
  AVAILABLE: "Tersedia",
  RENTED: "Disewa",
  MAINTENANCE: "Perawatan",
  UNAVAILABLE: "Tidak Tersedia",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  WAITING: "Menunggu",
  VERIFIED: "Terverifikasi",
  REJECTED: "Ditolak",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  SELF_DRIVE: "Lepas Kunci",
  WITH_DRIVER: "Dengan Supir",
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  MOBIL: "Mobil",
  MOTOR: "Motor",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  TRANSFER: "Transfer Bank",
  TUNAI: "Tunai",
};

export const PICKUP_METHOD_LABELS: Record<PickupMethod, string> = {
  SELF_PICKUP: "Ambil Sendiri",
  DELIVERY: "Diantar",
};
