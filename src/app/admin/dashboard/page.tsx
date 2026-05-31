"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/lib/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push("/login"); return; }
      if (user.role !== "ADMIN") { router.push("/dashboard"); return; }
      fetchStats();
    }
  }, [user, authLoading]);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {} finally { setLoading(false); }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Mobil", value: stats?.totalCars || 0, icon: "🚗", color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
    { label: "Mobil Tersedia", value: stats?.availableCars || 0, icon: "✅", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
    { label: "Menunggu Verif", value: stats?.waitingVerification || 0, icon: "⏳", color: "from-orange-500 to-orange-600", bg: "bg-orange-50" },
    { label: "Pesanan Hari Ini", value: stats?.todayBookings || 0, icon: "📋", color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Pendapatan", value: `Rp${(stats?.totalRevenue || 0).toLocaleString()}`, icon: "💰", color: "from-yellow-500 to-amber-500", bg: "bg-yellow-50" },
    { label: "Total Pelanggan", value: stats?.totalCustomers || 0, icon: "👥", color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F44]">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Selamat datang, {user?.name}
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="w-full sm:w-auto px-4 py-2.5 bg-[#F5B21A] hover:bg-[#d97706] text-[#0B1F44] font-medium rounded-xl text-xs sm:text-sm transition-colors shadow-sm text-center"
        >
          Lihat Pesanan
        </Link>
      </div>

      {/* Stats Grid - responsive: 2 cols on mobile, 3 on tablet, 6 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((card, i) => (
          <div key={i} className={`${card.bg} rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-transparent hover:shadow-md transition-all duration-200`}>
            <div className="text-xl sm:text-2xl mb-1 sm:mb-3">{card.icon}</div>
            <p className="text-[10px] sm:text-sm text-gray-500 mb-0.5 sm:mb-1 leading-tight">{card.label}</p>
            <p className={`text-sm sm:text-xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent break-all`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-[#0B1F44] text-sm sm:text-base">Pesanan Terbaru</h2>
          <Link href="/admin/bookings" className="text-xs text-[#F5B21A] hover:text-[#d97706] font-medium">Lihat Semua</Link>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-6 py-3 font-medium text-xs">Kode</th>
                <th className="px-6 py-3 font-medium text-xs">Customer</th>
                <th className="px-6 py-3 font-medium text-xs">Mobil</th>
                <th className="px-6 py-3 font-medium text-xs">Tanggal</th>
                <th className="px-6 py-3 font-medium text-xs">Total</th>
                <th className="px-6 py-3 font-medium text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.slice(0, 5).map((booking: any) => (
                <tr key={booking.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-mono text-xs text-gray-500">{booking.bookingCode}</td>
                  <td className="px-6 py-3 text-sm">{booking.user?.name || "Guest"}</td>
                  <td className="px-6 py-3 text-sm font-medium text-[#0B1F44]">{booking.car?.name}</td>
                  <td className="px-6 py-3 text-xs text-gray-500">{new Date(booking.startDate).toLocaleDateString("id-ID")}</td>
                  <td className="px-6 py-3 text-sm font-medium">Rp {booking.totalPrice?.toLocaleString()}</td>
                  <td className="px-6 py-3"><StatusBadge status={booking.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-50">
          {stats?.recentBookings?.slice(0, 5).map((booking: any) => (
            <div key={booking.id} className="p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#0B1F44] text-sm">{booking.car?.name}</span>
                <StatusBadge status={booking.status} />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-mono">{booking.bookingCode}</span>
                <span>{booking.user?.name || "Guest"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{new Date(booking.startDate).toLocaleDateString("id-ID")}</span>
                <span className="font-semibold text-[#0B1F44]">Rp {booking.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
          <div className="px-6 py-8 text-center text-gray-500 text-sm">Belum ada pesanan</div>
        )}
      </div>

      {/* Revenue Chart (simple) */}
      {stats?.revenueByMonth && Object.keys(stats.revenueByMonth).length > 0 && (
        <div className="mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="font-semibold text-[#0B1F44] text-sm sm:text-base mb-3 sm:mb-4">Pendapatan per Bulan</h2>
          <div className="flex items-end space-x-2 sm:space-x-3 h-20 sm:h-32">
            {Object.entries(stats.revenueByMonth as Record<string, number>)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([month, amount]) => {
                const maxRevenue = Math.max(...Object.values(stats.revenueByMonth as Record<string, number>));
                const height = maxRevenue > 0 ? (amount / maxRevenue) * 100 : 0;
                const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
                const [y, m] = month.split("-");
                const label = `${monthNames[parseInt(m) - 1]}`;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <span className="text-[8px] sm:text-[10px] text-gray-400 mb-1 hidden sm:block">Rp{(amount/1000).toFixed(0)}k</span>
                    <div className="w-full bg-gradient-to-t from-[#F5B21A] to-[#fbbf24] rounded-t-lg" style={{ height: `${height}%`, minHeight: height > 0 ? 4 : 0 }} />
                    <span className="text-[8px] sm:text-[10px] text-gray-500 mt-1">{label}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
