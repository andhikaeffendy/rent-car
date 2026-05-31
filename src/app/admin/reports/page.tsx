"use client";
import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";

export default function AdminReportsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  async function fetchBookings() {
    try {
      const params = filter ? `?status=${filter}` : "?status=all";
      const res = await fetch(`/api/bookings${params}`);
      const data = await res.json();
      if (data && Array.isArray(data.bookings)) setBookings(data.bookings);
    } catch {} finally {
      setLoading(false);
    }
  }

  // Filter by date range
  const filteredBookings = bookings.filter((b) => {
    if (startDate && new Date(b.startDate) < new Date(startDate)) return false;
    if (endDate && new Date(b.endDate) > new Date(endDate)) return false;
    return true;
  });

  const totalRevenue = filteredBookings
    .filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "WAITING_PAYMENT", label: "Menunggu Pembayaran" },
    { value: "WAITING_VERIFICATION", label: "Menunggu Verifikasi" },
    { value: "CONFIRMED", label: "Dikonfirmasi" },
    { value: "COMPLETED", label: "Selesai" },
    { value: "CANCELLED", label: "Dibatalkan" },
  ];

  function handlePrint() {
    window.print();
  }

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
            Laporan Transaksi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredBookings.length} transaksi
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-xl text-sm transition-colors shadow-sm inline-flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Cetak / Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] bg-white"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilter("");
                setStartDate("");
                setEndDate("");
              }}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Transaksi</p>
          <p className="text-2xl font-bold text-[#0B1F44] mt-1">
            {filteredBookings.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Pendapatan</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            Rp {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Pesanan Selesai</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {
              filteredBookings.filter((b) => b.status === "COMPLETED")
                .length
            }
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-6 py-3 font-medium">Kode</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Mobil</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Durasi</th>
                <th className="px-6 py-3 font-medium">Layanan</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {booking.bookingCode}
                  </td>
                  <td className="px-6 py-4">
                    {booking.user?.name || "Guest"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {booking.car?.name}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(booking.startDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4">{booking.duration} hari</td>
                  <td className="px-6 py-4 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg">
                      {booking.serviceType === "SELF_DRIVE"
                        ? "Lepas Kunci"
                        : "Dengan Supir"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0B1F44]">
                    Rp {booking.totalPrice?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#0B1F44] text-sm">{booking.car?.name}</span>
                <StatusBadge status={booking.status} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{booking.user?.name || "Guest"}</span>
                <span className="font-mono text-gray-400">{booking.bookingCode}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {new Date(booking.startDate).toLocaleDateString("id-ID")} · {booking.duration} hr
                </span>
                <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-[10px]">
                  {booking.serviceType === "SELF_DRIVE" ? "Lepas Kunci" : "Dengan Supir"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-50">
                <span className="text-gray-400">Total</span>
                <span className="font-bold text-[#0B1F44]">Rp {booking.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">Tidak ada transaksi</div>
          )}
        </div>
      </div>
    </div>
  );
}
