"use client";
import { useState, useEffect } from "react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/bookings?all=true")
      .then(r => r.json())
      .then(d => {
        const unique = new Map();
        (d.bookings || []).forEach((b: any) => { if (b.user?.id) unique.set(b.user.id, b.user); });
        setCustomers(Array.from(unique.values()));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#0B1F44]">Pelanggan</h2>
          <p className="text-xs text-gray-400">{customers.length} pelanggan</p>
        </div>
        <div className="relative max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Cari pelanggan..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-[#0B1F44]">Pelanggan Tidak Ditemukan</h3>
          <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci pencarian.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((user: any) => (
            <div key={user.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#F5B21A]/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#b45309]">{user.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-[#0B1F44] text-sm">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role || "CUSTOMER"}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p>{user.email || "—"}</p>
                <p>{user.phone || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
