"use client";
import { useEffect } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { useAdminStore } from "@/lib/stores/adminStore";

type StatCard = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  color: string;
  bg: string;
  text: string;
  prefix?: string;
  format?: boolean;
  href?: string;
};

const statCards: StatCard[] = [
  {
    key: "totalCars", label: "Total Kendaraan",
    color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600",
    href: "/admin/cars",
  },
  {
    key: "availableCars", label: "Tersedia",
    color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600",
    href: "/admin/cars",
  },
  {
    key: "waitingVerification", label: "Menunggu Verif",
    color: "from-orange-500 to-orange-600", bg: "bg-orange-50", text: "text-orange-600",
    href: "/admin/bookings",
  },
  {
    key: "totalRevenue", label: "Total Pendapatan", prefix: "Rp", format: true,
    color: "from-[#F5B21A] to-amber-600", bg: "bg-amber-50", text: "text-amber-600",
  },
  {
    key: "todayBookings", label: "Pesanan Hari Ini",
    color: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600",
  },
  {
    key: "totalCustomers", label: "Total Pelanggan",
    color: "from-pink-500 to-pink-600", bg: "bg-pink-50", text: "text-pink-600",
    href: "/admin/customers",
  },
];

function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3" />
      <div className="w-20 h-7 bg-gray-200 rounded mb-1" />
      <div className="w-16 h-3 bg-gray-200 rounded" />
    </div>
  );
}

function formatMoney(val: number): string {
  const num = val || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "jt";
  if (num >= 1000) return (num / 1000).toFixed(0) + "rb";
  return num.toString();
}

export default function AdminDashboard() {
  const { stats, loading, fetchStats } = useAdminStore();

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {[1,2,3,4,5,6].map(i => <StatSkeleton key={i} />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {[1,2].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-4" />
              {[1,2,3,4,5].map(j => (
                <div key={j} className="flex items-center space-x-4 p-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2"><div className="w-32 h-4 bg-gray-200 rounded" /><div className="w-20 h-3 bg-gray-200 rounded" /></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const s = stats || {};

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => {
          const raw = (s as any)[card.key] || 0;
          const value = card.format ? formatMoney(raw) : raw;
          const display = card.prefix ? card.prefix + value : value;
          const icon = (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={
                card.key === "totalCars" ? "M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" :
                card.key === "availableCars" ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" :
                card.key === "waitingVerification" ? "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" :
                card.key === "totalRevenue" ? "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" :
                card.key === "todayBookings" ? "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" :
                "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              } />
            </svg>
          );

          if (card.href) {
            return (
              <Link key={card.key} href={card.href} className="block group">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className={"w-10 h-10 rounded-xl " + card.bg + " " + card.text + " flex items-center justify-center"}>
                      {icon}
                    </div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-[#0B1F44]">{display}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
                </div>
              </Link>
            );
          }

          return (
            <div key={card.key}>
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={"w-10 h-10 rounded-xl " + card.bg + " " + card.text + " flex items-center justify-center"}>
                    {icon}
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#0B1F44]">{display}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent + Revenue */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-[#0B1F44] mb-4">Pesanan Terbaru</h2>
          {s.recentBookings && s.recentBookings.length > 0 ? (
            <div className="space-y-1">
              {(s.recentBookings as any[]).slice(0, 5).map((bk: any, i: number) => (
                <Link key={bk.id || i} href="/admin/bookings" className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {bk.car?.imageUrl ? (
                      <img src={bk.car.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0B1F44] truncate">{bk.car?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-400">{bk.user?.name || "Guest"}</p>
                  </div>
                  <StatusBadge status={bk.status} type="booking" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10"><p className="text-gray-400 text-sm">Belum ada pesanan</p></div>
          )}
          <Link href="/admin/bookings" className="block text-center mt-4 pt-3 border-t border-gray-100 text-xs font-medium text-[#F5B21A] hover:text-[#d97706] transition-colors">
            Lihat Semua Pesanan
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-[#0B1F44] mb-4">Pendapatan per Bulan</h2>
          {s.revenueByMonth && Object.keys(s.revenueByMonth).length > 0 ? (
            <div className="space-y-2">
              {(Object.entries(s.revenueByMonth as Record<string, number>)).slice(-6).map(([month, amount]) => {
                const maxAmount = Math.max(...Object.values(s.revenueByMonth as Record<string, number>));
                const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                const m = parseInt(month.split("-")[1]) - 1;
                const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
                return (
                  <div key={month} className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400 w-16 text-right">{months[m]}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#F5B21A] to-amber-500 rounded-full transition-all" style={{width: height + "%"}} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-20 text-right">Rp{(amount / 1000).toFixed(0)}k</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10"><p className="text-gray-400 text-sm">Belum ada data pendapatan</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
