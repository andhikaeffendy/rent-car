"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

interface BookingDetail {
  id: string;
  bookingCode: string;
  serviceType: string;
  pickupMethod: string;
  pickupAddress: string | null;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  duration: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  notes: string | null;
  status: string;
  createdAt: string;
  car: { name: string; imageUrl: string; transmission: string };
  user: { name: string; email: string; phone: string } | null;
  payments: {
    id: string;
    amount: number;
    transferProofUrl: string;
    status: string;
  }[];
  documents: { id: string; ktpUrl: string }[];
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(
    null
  );

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  async function fetchBookings() {
    try {
      const params = filter ? `?status=${filter}` : "";
      const res = await fetch(`/api/bookings${params}`);
      const data = await res.json();
      if (data && Array.isArray(data.bookings)) setBookings(data.bookings);
    } catch {} finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    if (
      status === "REJECTED" &&
      !confirm("Tolak pesanan ini? Pesanan akan dibatalkan.")
    )
      return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        alert("Gagal update status");
        return;
      }
      fetchBookings();
      setSelectedBooking(null);
    } catch {
      alert("Gagal update status");
    }
  }

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "WAITING_PAYMENT", label: "Menunggu Pembayaran" },
    { value: "WAITING_VERIFICATION", label: "Menunggu Verifikasi" },
    { value: "CONFIRMED", label: "Dikonfirmasi" },
    { value: "REJECTED", label: "Ditolak" },
    { value: "ON_RENT", label: "Sedang Disewa" },
    { value: "COMPLETED", label: "Selesai" },
    { value: "CANCELLED", label: "Dibatalkan" },
  ];

  const SERVICE_LABELS: Record<string, string> = {
    SELF_DRIVE: "Lepas Kunci",
    WITH_DRIVER: "Dengan Supir",
  };

  const PICKUP_LABELS: Record<string, string> = {
    SELF_PICKUP: "Ambil Sendiri",
    DELIVERY: "Diantar",
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F44]">Kelola Pesanan</h1>
          <p className="text-sm text-gray-500 mt-1">
            {bookings.length} pesanan
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A] bg-white"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Booking Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-6 py-3 font-medium">Kode</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Mobil</th>
                <th className="px-6 py-3 font-medium">Layanan</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-gray-50 hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {booking.bookingCode}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#0B1F44]">
                        {booking.user?.name || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.user?.email || "-"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {booking.car?.name}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg">
                      {SERVICE_LABELS[booking.serviceType] || booking.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <p>
                      {new Date(booking.startDate).toLocaleDateString("id-ID")}
                    </p>
                    <p className="text-gray-400">
                      - {new Date(booking.endDate).toLocaleDateString("id-ID")}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0B1F44]">
                    Rp {booking.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {booking.status === "WAITING_VERIFICATION" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(booking.id, "CONFIRMED");
                            }}
                            className="text-xs text-green-600 hover:text-green-800 font-medium"
                          >
                            Konfirmasi
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(booking.id, "REJECTED");
                            }}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(booking.id, "COMPLETED");
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Selesaikan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Belum ada pesanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 hover:bg-gray-50/50 cursor-pointer active:bg-gray-100"
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="font-semibold text-[#0B1F44] text-sm truncate">
                    {booking.car?.name}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                    {booking.bookingCode}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>{booking.user?.name || "Guest"}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-[10px]">
                  {SERVICE_LABELS[booking.serviceType] || booking.serviceType}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  {new Date(booking.startDate).toLocaleDateString("id-ID")} - {new Date(booking.endDate).toLocaleDateString("id-ID")}
                </span>
                <span className="font-bold text-[#0B1F44]">
                  Rp {booking.totalPrice.toLocaleString()}
                </span>
              </div>
              {booking.status === "WAITING_VERIFICATION" && (
                <div className="flex space-x-2 mt-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(booking.id, "CONFIRMED");
                    }}
                    className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium"
                  >
                    Konfirmasi
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(booking.id, "REJECTED");
                    }}
                    className="flex-1 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-medium"
                  >
                    Tolak
                  </button>
                </div>
              )}
              {booking.status === "CONFIRMED" && (
                <div className="mt-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(booking.id, "COMPLETED");
                    }}
                    className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                  >
                    Tandai Selesai
                  </button>
                </div>
              )}
            </div>
          ))}
          {bookings.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Belum ada pesanan
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedBooking(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <h2 className="font-bold text-[#0B1F44]">
                  Detail Pesanan
                </h2>
                <StatusBadge status={selectedBooking.status} />
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Kode Booking</p>
                  <p className="font-mono font-medium text-[#0B1F44]">
                    {selectedBooking.bookingCode}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Pesan</p>
                  <p className="font-medium text-[#0B1F44]">
                    {new Date(selectedBooking.createdAt).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Layanan</p>
                  <p className="font-medium text-[#0B1F44]">
                    {SERVICE_LABELS[selectedBooking.serviceType] ||
                      selectedBooking.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Metode Pembayaran</p>
                  <p className="font-medium text-[#0B1F44]">
                    {selectedBooking.paymentMethod === "TUNAI" ? "Tunai" : "Transfer Bank"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Metode Pengambilan</p>
                  <p className="font-medium text-[#0B1F44]">
                    {PICKUP_LABELS[selectedBooking.pickupMethod] ||
                      selectedBooking.pickupMethod}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-[#0B1F44] mb-3">
                  Data Pelanggan
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Nama</p>
                    <p className="font-medium">
                      {selectedBooking.user?.name || "Guest"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">
                      {selectedBooking.user?.email || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Telepon</p>
                    <p className="font-medium">
                      {selectedBooking.user?.phone || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Car Info */}
              <div className="flex items-start space-x-4 bg-gray-50 rounded-xl p-4">
                <div className="w-20 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                  <img
                    src={selectedBooking.car?.imageUrl}
                    alt={selectedBooking.car?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1F44]">
                    {selectedBooking.car?.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedBooking.car?.transmission}
                  </p>
                </div>
              </div>

              {/* Date & Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Tanggal Mulai</p>
                  <p className="font-medium">
                    {new Date(selectedBooking.startDate).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Selesai</p>
                  <p className="font-medium">
                    {new Date(selectedBooking.endDate).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Durasi</p>
                  <p className="font-medium">
                    {selectedBooking.duration} hari
                  </p>
                </div>
                {selectedBooking.pickupAddress && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Alamat Pengantaran</p>
                    <p className="font-medium">
                      {selectedBooking.pickupAddress}
                    </p>
                  </div>
                )}
              </div>

              {/* Documents */}
              {selectedBooking.documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#0B1F44] mb-2">
                    Dokumen KTP
                  </h3>
                  <img
                    src={selectedBooking.documents[0].ktpUrl}
                    alt="KTP"
                    className="w-full rounded-xl border border-gray-200"
                  />
                </div>
              )}

              {/* Payment */}
              {selectedBooking.payments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#0B1F44] mb-2">
                    Bukti Transfer
                  </h3>
                  <img
                    src={selectedBooking.payments[0].transferProofUrl}
                    alt="Bukti Transfer"
                    className="w-full rounded-xl border border-gray-200"
                  />
                  <div className="mt-2">
                    <StatusBadge
                      status={selectedBooking.payments[0].status}
                      type="payment"
                    />
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">
                    Rp {selectedBooking.subtotal.toLocaleString()}
                  </span>
                </div>
                {selectedBooking.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Biaya Antar</span>
                    <span className="font-medium">
                      Rp {selectedBooking.deliveryFee.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                  <span className="text-[#0B1F44]">Total</span>
                  <span className="text-[#F5B21A]">
                    Rp {selectedBooking.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-xs text-yellow-700 font-medium mb-1">
                    Catatan
                  </p>
                  <p className="text-sm text-yellow-800">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                {selectedBooking.status === "WAITING_VERIFICATION" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(selectedBooking.id, "CONFIRMED")
                      }
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
                    >
                      Konfirmasi Pesanan
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(selectedBooking.id, "REJECTED")
                      }
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
                    >
                      Tolak Pesanan
                    </button>
                  </>
                )}
                {selectedBooking.status === "CONFIRMED" && (
                  <button
                    onClick={() =>
                      updateStatus(selectedBooking.id, "COMPLETED")
                    }
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Tandai Selesai
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
