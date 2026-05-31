"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  async function fetchPayments() {
    try {
      const params = filter ? `?status=${filter}` : "";
      const res = await fetch(`/api/payments${params}`);
      const data = await res.json();
      if (data && Array.isArray(data.payments)) setPayments(data.payments);
    } catch {} finally {
      setLoading(false);
    }
  }

  async function verifyPayment(id: string, status: string) {
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchPayments();
        setSelectedPayment(null);
      } else {
        alert("Gagal verifikasi pembayaran");
      }
    } catch {
      alert("Gagal verifikasi pembayaran");
    }
  }

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "WAITING", label: "Menunggu" },
    { value: "VERIFIED", label: "Terverifikasi" },
    { value: "REJECTED", label: "Ditolak" },
  ];

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
          <h1 className="text-2xl font-bold text-[#0B1F44]">
            Verifikasi Pembayaran
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {payments.length} pembayaran
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] bg-white"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-6 py-3 font-medium">Kode Booking</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Mobil</th>
                <th className="px-6 py-3 font-medium">Jumlah</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-gray-50 hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => setSelectedPayment(payment)}
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {payment.booking?.bookingCode || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {payment.booking?.user?.name ||
                      payment.booking?.customerName ||
                      "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {payment.booking?.car?.name || "-"}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0B1F44]">
                    Rp {payment.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={payment.status} type="payment" />
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    {payment.status === "WAITING" && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPayment(payment);
                        }}
                        className="text-[#0F5EF7] hover:text-blue-700 text-xs font-medium cursor-pointer"
                      >
                        Verifikasi
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Belum ada pembayaran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="p-4 hover:bg-gray-50/50 cursor-pointer active:bg-gray-100"
              onClick={() => setSelectedPayment(payment)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="font-semibold text-[#0B1F44] text-sm truncate">
                    {payment.booking?.car?.name || "-"}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                    {payment.booking?.bookingCode || "-"}
                  </p>
                </div>
                <StatusBadge status={payment.status} type="payment" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {payment.booking?.user?.name || payment.booking?.customerName || "-"}
                </span>
                <span className="font-bold text-[#0B1F44]">
                  Rp {payment.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-400">
                  {new Date(payment.createdAt).toLocaleDateString("id-ID")}
                </span>
                {payment.status === "WAITING" && (
                  <span className="text-[#0F5EF7] font-medium">
                    Ketuk untuk verifikasi
                  </span>
                )}
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Belum ada pembayaran
            </div>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedPayment(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0B1F44]">Detail Pembayaran</h2>
              <button
                onClick={() => setSelectedPayment(null)}
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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Kode Booking</p>
                  <p className="font-mono font-medium">
                    {selectedPayment.booking?.bookingCode}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jumlah</p>
                  <p className="font-bold text-lg text-[#F5B21A]">
                    Rp {selectedPayment.amount?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Bukti Transfer</p>
                <img
                  src={selectedPayment.transferProofUrl}
                  alt="Bukti Transfer"
                  className="w-full rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-center">
                <StatusBadge
                  status={selectedPayment.status}
                  type="payment"
                />
              </div>

              {selectedPayment.status === "WAITING" && (
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() =>
                      verifyPayment(selectedPayment.id, "VERIFIED")
                    }
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Verifikasi
                  </button>
                  <button
                    onClick={() =>
                      verifyPayment(selectedPayment.id, "REJECTED")
                    }
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
