"use client";
import { useEffect } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { useAdminStore } from "@/lib/stores/adminStore";

const cards = [
  { key: "totalCars", label: "Total Kendaraan", color: "bg-blue-50 text-blue-600", href: "/admin/cars", icon: "M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" },
  { key: "availableCars", label: "Tersedia", color: "bg-emerald-50 text-emerald-600", href: "/admin/cars", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "waitingVerification", label: "Menunggu Verif", color: "bg-orange-50 text-orange-600", href: "/admin/bookings", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "totalRevenue", label: "Total Pendapatan", prefix: "Rp", format: true, color: "bg-amber-50 text-amber-600", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "todayBookings", label: "Pesanan Hari Ini", color: "bg-purple-50 text-purple-600", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "totalCustomers", label: "Total Pelanggan", color: "bg-pink-50 text-pink-600", href: "/admin/customers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
];

function S() { return <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse"><div className="w-9 h-9 bg-slate-100 rounded-lg mb-3" /><div className="w-20 h-6 bg-slate-100 rounded mb-1" /><div className="w-16 h-3 bg-slate-100 rounded" /></div>; }

function fmt(v: number) { const n = v || 0; if (n >= 1000000) return (n/1000000).toFixed(1)+"jt"; if (n >= 1000) return (n/1000).toFixed(0)+"rb"; return n.toString(); }

export default function AdminDashboard() {
  const { stats, loading, fetchStats } = useAdminStore();
  useEffect(() => { fetchStats(); }, [fetchStats]);
  const s = stats || {};

  if (loading) return <div><div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">{[1,2,3,4,5,6].map(i => <S key={i} />)}</div><div className="grid lg:grid-cols-2 gap-6">{[1,2].map(i => <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"><div className="w-32 h-5 bg-slate-100 rounded mb-4" />{[1,2,3,4,5].map(j => <div key={j} className="flex items-center space-x-4 p-3"><div className="w-10 h-10 bg-slate-100 rounded-lg" /><div className="flex-1 space-y-2"><div className="w-32 h-4 bg-slate-100 rounded" /><div className="w-20 h-3 bg-slate-100 rounded" /></div></div>)}</div>)}</div></div>;

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {cards.map(c => {
          const raw = (s as any)[c.key] || 0;
          const val = c.format ? fmt(raw) : raw;
          const dsp = c.prefix ? c.prefix + val : val;
          return (
            <div key={c.key}>
              {c.href ? (
                <Link href={c.href} className="block group">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className={"w-9 h-9 rounded-lg " + c.color + " flex items-center justify-center mb-3"}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} /></svg></div>
                    <p className="text-xl font-bold text-slate-900">{dsp}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.label}</p>
                  </div>
                </Link>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className={"w-9 h-9 rounded-lg " + c.color + " flex items-center justify-center mb-3"}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} /></svg></div>
                  <p className="text-xl font-bold text-slate-900">{dsp}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.label}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4 text-sm">Pesanan Terbaru</h2>
          {s.recentBookings?.length > 0 ? (
            <div className="space-y-1">{(s.recentBookings as any[]).slice(0,5).map((bk: any, i: number) => (
              <Link key={bk.id||i} href="/admin/bookings" className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">{bk.car?.imageUrl ? <img src={bk.car.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" /></svg></div>}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900 truncate">{bk.car?.name || "—"}</p><p className="text-xs text-slate-400">{bk.user?.name || "Guest"}</p></div>
                <StatusBadge status={bk.status} />
              </Link>
            ))}</div>
          ) : <div className="text-center py-10"><p className="text-sm text-slate-400">Belum ada pesanan</p></div>}
          <Link href="/admin/bookings" className="block text-center mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors">Lihat Semua Pesanan</Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4 text-sm">Pendapatan per Bulan</h2>
          {s.revenueByMonth && Object.keys(s.revenueByMonth).length > 0 ? (
            <div className="space-y-2">{(Object.entries(s.revenueByMonth as Record<string, number>)).slice(-6).map(([month, amount]) => {
              const maxA = Math.max(...Object.values(s.revenueByMonth as Record<string, number>));
              const pct = maxA > 0 ? (amount / maxA) * 100 : 0;
              const m = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][parseInt(month.split("-")[1])-1];
              return <div key={month} className="flex items-center space-x-3"><span className="text-xs text-slate-400 w-12 text-right">{m}</span><div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all" style={{width: pct+"%"}} /></div><span className="text-xs font-medium text-slate-500 w-20 text-right">{(amount/1000).toFixed(0)}k</span></div>;
            })}</div>
          ) : <div className="text-center py-10"><p className="text-sm text-slate-400">Belum ada data</p></div>}
        </div>
      </div>
    </div>
  );
}
