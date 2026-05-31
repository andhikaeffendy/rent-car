"use client";
import {
  BookingStatus,
  CarStatus,
  PaymentStatus,
  BOOKING_STATUS_LABELS,
  CAR_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/types";

interface StatusBadgeProps {
  status: string;
  type?: "booking" | "car" | "payment";
}

export default function StatusBadge({
  status,
  type = "booking",
}: StatusBadgeProps) {
  // Get label
  let label: string = status;
  let colors: string;

  if (type === "booking") {
    label = BOOKING_STATUS_LABELS[status as BookingStatus] || status;
    switch (status) {
      case "WAITING_PAYMENT":
        colors = "bg-yellow-100 text-yellow-700 border-yellow-200";
        break;
      case "WAITING_VERIFICATION":
        colors = "bg-orange-100 text-orange-700 border-orange-200";
        break;
      case "CONFIRMED":
        colors = "bg-green-100 text-green-700 border-green-200";
        break;
      case "REJECTED":
        colors = "bg-red-100 text-red-700 border-red-200";
        break;
      case "ON_RENT":
        colors = "bg-blue-100 text-blue-700 border-blue-200";
        break;
      case "COMPLETED":
        colors = "bg-gray-100 text-gray-600 border-gray-200";
        break;
      case "CANCELLED":
        colors = "bg-red-50 text-red-500 border-red-100";
        break;
      default:
        colors = "bg-gray-100 text-gray-600 border-gray-200";
    }
  } else if (type === "car") {
    label = CAR_STATUS_LABELS[status as CarStatus] || status;
    switch (status) {
      case "AVAILABLE":
        colors = "bg-green-100 text-green-700 border-green-200";
        break;
      case "RENTED":
        colors = "bg-blue-100 text-blue-700 border-blue-200";
        break;
      case "MAINTENANCE":
        colors = "bg-orange-100 text-orange-700 border-orange-200";
        break;
      case "UNAVAILABLE":
        colors = "bg-red-100 text-red-700 border-red-200";
        break;
      default:
        colors = "bg-gray-100 text-gray-600 border-gray-200";
    }
  } else {
    label = PAYMENT_STATUS_LABELS[status as PaymentStatus] || status;
    switch (status) {
      case "WAITING":
        colors = "bg-yellow-100 text-yellow-700 border-yellow-200";
        break;
      case "VERIFIED":
        colors = "bg-green-100 text-green-700 border-green-200";
        break;
      case "REJECTED":
        colors = "bg-red-100 text-red-700 border-red-200";
        break;
      default:
        colors = "bg-gray-100 text-gray-600 border-gray-200";
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "WAITING_PAYMENT" || status === "WAITING" || status === "WAITING_VERIFICATION"
            ? "bg-current animate-pulse"
            : "bg-current"
        }`}
      />
      {label}
    </span>
  );
}
