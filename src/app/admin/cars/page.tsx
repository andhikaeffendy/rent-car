"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { useCarStore } from "@/lib/stores/carStore";

export default function AdminCarsPage() {
  const { cars, loading, error, fetchCars } = useCarStore();
  useEffect(() => { fetchCars(); }, [fetchCars]);

  async function handleDelete(id: string, name: string) {
    if (!confirm("Hapus " + name + "?")) return;
    try {
      const res = await fetch("/api/cars/" + id, { method: "DELETE" });
      if (res.ok) fetchCars(); else alert("Gagal menghapus");
    } catch { alert("Gagal"); }
  }

  if (loading) return (
    <div>
      <div className="flex justify-between mb-6"><div className="w-32 h-8 bg-slate-100 rounded-lg animate-pulse" /><div className="w-36 h-10 bg-slate-100 rounded-lg animate-pulse" /></div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">{[1,2,3,4,5,6].map(i => <div key={i} className="flex items-center space-x-4 p-4 border-b border-slate-100"><div className="w-14 h-14 bg-slate-100 rounded-lg" /><div className="flex-1 space-y-2"><div className="w-40 h-4 bg-slate-100 rounded" /><div className="w-20 h-3 bg-slate-100 rounded" /></div><div className="w-20 h-6 bg-slate-100 rounded-full" /></div>)}</div>
    </div>
  );

  if (error) return <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center"><p className="text-red-600 font-medium">Gagal memuat data</p><p className="text-sm text-red-400 mt-1">{error}</p><button onClick={() => fetchCars()} className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors">Coba Lagi</button></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><p className="text-sm font-semibold text-slate-900">Kendaraan</p><p className="text-xs text-slate-400">{cars.length} kendaraan terdaftar</p></div>
        <Link href="/admin/cars/new" className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition-all shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span>Tambah Kendaraan</span>
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" /></svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Belum Ada Kendaraan</h3>
          <p className="text-sm text-slate-400 mb-4">Tambahkan kendaraan pertama Anda.</p>
          <Link href="/admin/cars/new" className="inline-flex px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm transition-colors">Tambah Kendaraan</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Kendaraan</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Tipe</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Transmisi</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Kapasitas</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Harga/hari</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Status</th>
                <th className="px-5 py-3.5 text-right"></th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {cars.map((car: any) => (
                  <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4"><div className="flex items-center space-x-3"><div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">{car.imageUrl ? <img src={car.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" /></svg></div>}</div><p className="font-medium text-slate-900">{car.name}</p></div></td>
                    <td className="px-5 py-4"><span className={"px-2 py-0.5 rounded-md text-xs font-medium " + (car.type === "MOTOR" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600")}>{car.type === "MOTOR" ? "Motor" : "Mobil"}</span></td>
                    <td className="px-5 py-4"><span className="text-slate-600">{car.transmission}</span></td>
                    <td className="px-5 py-4"><span className="text-slate-600">{car.capacity}</span></td>
                    <td className="px-5 py-4"><span className="font-medium text-slate-900">{formatPrice(car.priceSelfDrive)}</span></td>
                    <td className="px-5 py-4"><StatusBadge status={car.status} /></td>
                    <td className="px-5 py-4 text-right"><div className="flex items-center justify-end space-x-2">
                      <Link href={"/admin/cars/" + car.id + "/edit"} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">Edit</Link>
                      <button onClick={() => handleDelete(car.id, car.name)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs font-medium transition-colors">Hapus</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden divide-y divide-slate-100">
            {cars.map((car: any) => (
              <div key={car.id} className="p-4">
                <div className="flex items-center space-x-3 mb-2"><div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">{car.imageUrl ? <img src={car.imageUrl} alt="" className="w-full h-full object-cover" /> : null}</div>
                  <div className="flex-1"><p className="font-medium text-slate-900 text-sm">{car.name}</p><div className="flex items-center space-x-2 mt-0.5"><span className={"px-1.5 py-0.5 rounded text-xs font-medium " + (car.type === "MOTOR" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600")}>{car.type === "MOTOR" ? "Motor" : "Mobil"}</span><StatusBadge status={car.status} /></div></div>
                </div>
                <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-900">{formatPrice(car.priceSelfDrive)}/hari</p><div className="flex space-x-2"><Link href={"/admin/cars/"+car.id+"/edit"} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs transition-colors">Edit</Link><button onClick={() => handleDelete(car.id, car.name)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs transition-colors">Hapus</button></div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
