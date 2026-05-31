"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

interface CarItem {
  id: string;
  name: string;
  slug: string;
  transmission: string;
  capacity: number;
  priceSelfDrive: number;
  priceWithDriver: number | null;
  status: string;
  imageUrl: string;
}

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    fetchCars();
    const checkMobile = () => setMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  async function fetchCars() {
    try {
      const res = await fetch("/api/cars?status=all");
      const data = await res.json();
      if (data && Array.isArray(data.cars)) setCars(data.cars);
    } catch {
      console.error("Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus mobil ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (res.ok) fetchCars();
      else alert("Gagal menghapus mobil");
    } catch {
      alert("Gagal menghapus");
    }
  }

  async function toggleStatus(car: CarItem) {
    const newStatus =
      car.status === "AVAILABLE"
        ? "MAINTENANCE"
        : car.status === "MAINTENANCE"
        ? "UNAVAILABLE"
        : "AVAILABLE";
    try {
      const res = await fetch(`/api/cars/${car.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...car, status: newStatus }),
      });
      if (res.ok) fetchCars();
    } catch {
      alert("Gagal update status");
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F44]">Kelola Mobil</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{cars.length} mobil terdaftar</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="w-full sm:w-auto px-4 py-2.5 bg-[#F5B21A] hover:bg-[#d97706] text-[#0B1F44] font-medium rounded-xl text-xs sm:text-sm transition-colors shadow-sm inline-flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Mobil
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-6 py-3 font-medium">Mobil</th>
                <th className="px-6 py-3 font-medium">Transmisi</th>
                <th className="px-6 py-3 font-medium">Kursi</th>
                <th className="px-6 py-3 font-medium">Lepas Kunci</th>
                <th className="px-6 py-3 font-medium">Dengan Supir</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-[#0B1F44] text-sm">{car.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{car.transmission}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{car.capacity}</td>
                  <td className="px-6 py-4 font-medium text-[#0B1F44] text-sm">
                    Rp {car.priceSelfDrive.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {car.priceWithDriver ? `Rp ${car.priceWithDriver.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={car.status} type="car" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Link href={`/admin/cars/${car.id}/edit`} className="text-[#0F5EF7] hover:text-blue-700 text-xs font-medium">
                        Edit
                      </Link>
                      <button onClick={() => toggleStatus(car)} className="text-orange-600 hover:text-orange-800 text-xs font-medium">
                        Ubah Status
                      </button>
                      <button onClick={() => handleDelete(car.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Belum ada mobil.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {cars.map((car) => (
          <div key={car.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-16 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#0B1F44] text-sm truncate">{car.name}</h3>
                <p className="text-xs text-gray-500">{car.transmission} · {car.capacity} kursi</p>
                <div className="mt-1">
                  <StatusBadge status={car.status} type="car" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-gray-400">Lepas Kunci</p>
                <p className="font-bold text-[#F5B21A]">Rp{car.priceSelfDrive.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-gray-400">Dengan Supir</p>
                <p className="font-bold text-[#0F5EF7]">{car.priceWithDriver ? `Rp${car.priceWithDriver.toLocaleString()}` : "—"}</p>
              </div>
            </div>
            <div className="flex space-x-2 pt-2 border-t border-gray-50">
              <Link href={`/admin/cars/${car.id}/edit`} className="flex-1 py-2 bg-[#0F5EF7]/10 text-[#0F5EF7] rounded-lg text-xs font-medium text-center">Edit</Link>
              <button onClick={() => toggleStatus(car)} className="flex-1 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium">Status</button>
              <button onClick={() => handleDelete(car.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium">Hapus</button>
            </div>
          </div>
        ))}
        {cars.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500 text-sm">Belum ada mobil.</p>
          </div>
        )}
      </div>
    </div>
  );
}
