"use client";

interface StatusBadgeProps {
  status: string;
  type?: "booking" | "car";
}

const STATUS_STYLES: Record<string, string> = {
  // Booking statuses
  WAITING_PAYMENT: "bg-amber-50 text-amber-600 border border-amber-200/50",
  WAITING_VERIFICATION: "bg-orange-50 text-orange-600 border border-orange-200/50",
  CONFIRMED: "bg-emerald-50 text-emerald-600 border border-emerald-200/50",
  ON_RENT: "bg-blue-50 text-blue-600 border border-blue-200/50",
  COMPLETED: "bg-slate-100 text-slate-500 border border-slate-200/50",
  REJECTED: "bg-red-50 text-red-500 border border-red-200/50",
  CANCELLED: "bg-pink-50 text-pink-500 border border-pink-200/50",
  // Car statuses
  AVAILABLE: "bg-emerald-50 text-emerald-600 border border-emerald-200/50",
  RENTED: "bg-blue-50 text-blue-600 border border-blue-200/50",
  MAINTENANCE: "bg-orange-50 text-orange-600 border border-orange-200/50",
  UNAVAILABLE: "bg-red-50 text-red-500 border border-red-200/50",
};

const STATUS_LABELS: Record<string, string> = {
  WAITING_PAYMENT: "Menunggu Bayar",
  WAITING_VERIFICATION: "Menunggu Verif",
  CONFIRMED: "Dikonfirmasi",
  ON_RENT: "Sedang Disewa",
  COMPLETED: "Selesai",
  REJECTED: "Ditolak",
  CANCELLED: "Dibatalkan",
  AVAILABLE: "Tersedia",
  RENTED: "Sedang Disewa",
  MAINTENANCE: "Perawatan",
  UNAVAILABLE: "Tidak Tersedia",
};

export default function StatusBadge({ status, type = "booking" }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-600 border border-gray-200/50";
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={"inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium " + style}>
      <span className={"w-1.5 h-1.5 rounded-full mr-1.5 " + (
        status === "WAITING_PAYMENT" || status === "WAITING_VERIFICATION" ? "bg-current animate-pulse" :
        status === "CONFIRMED" || status === "AVAILABLE" ? "bg-current" :
        status === "COMPLETED" ? "bg-current opacity-60" :
        "bg-current"
      )} />
      {label}
    </span>
  );
}
