"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" /></div>;

  const totalRevenue = stats?.totalRevenue || 0;
  const monthlyRevenue = stats?.revenueByMonth || {};

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#0B1F44]">Laporan</h2>
        <p className="text-xs text-gray-400">Ringkasan pendapatan dan statistik</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-[#0B1F44] mb-4">Pendapatan Bulanan</h3>
            {Object.keys(monthlyRevenue).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(monthlyRevenue as Record<string, number>).slice(-12).reverse().map(([month, amount]) => {
                  const maxVal = Math.max(...Object.values(monthlyRevenue as Record<string, number>));
                  const pct = maxVal > 0 ? (amount / maxVal) * 100 : 0;
                  const m = parseInt(month.split("-")[1]) - 1;
                  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
                  return (
                    <div key={month} className="flex items-center space-x-3">
                      <span className="text-xs text-gray-400 w-12 text-right">{months[m]}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#F5B21A] to-amber-500 rounded-full transition-all" style={{width: pct + "%"}} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-24 text-right">{formatPrice(amount)}</span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-sm text-gray-400">Belum ada data</p>}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Total Pendapatan</p>
            <p className="text-2xl font-bold text-[#0B1F44]">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Total Mobil</p>
            <p className="text-2xl font-bold text-[#0B1F44]">{stats?.totalCars || 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Total Pesanan</p>
            <p className="text-2xl font-bold text-[#0B1F44]">{stats?.todayBookings || 0} hari ini</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Pelanggan</p>
            <p className="text-2xl font-bold text-[#0B1F44]">{stats?.totalCustomers || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
