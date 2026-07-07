"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Car } from "@/types";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    transmission: "",
    type: "",
    capacity: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  async function fetchCars() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const res = await fetch(`/api/cars?${params.toString()}`);
      const data = await res.json();
      if (data && Array.isArray(data.cars)) setCars(data.cars);
    } catch {} finally {
      setLoading(false);
    }
  }

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      transmission: "",
      type: "",
    capacity: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    });
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#0B1F44]">
                Daftar Kendaraan
              </h1>
              <p className="text-gray-500 mt-1">
                Armada Agil Rental Mobil — Ambon
              </p>
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex space-x-2 mb-6">
            {["", "MOBIL", "MOTOR"].map((val) => (
              <button
                key={val}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, type: prev.type === val ? "" : val }));
                }}
                className={"px-6 py-2.5 rounded-xl text-sm font-bold transition-all " + (
                  filters.type === val
                    ? "bg-[#0B1F44] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#F5B21A] hover:text-[#F5B21A]"
                )}
              >
                {val || "Semua"}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-medium text-gray-500">
                  Transmisi:
                </label>
                <div className="flex space-x-1">
                  {["", "AT", "MT"].map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        handleFilterChange(
                          "transmission",
                          filters.transmission === val ? "" : val
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.transmission === val
                          ? "bg-[#0B1F44] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {val || "Semua"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-xs font-medium text-gray-500">
                  Kursi:
                </label>
                <div className="flex space-x-1">
                  {["", "4", "5", "7"].map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        handleFilterChange(
                          "capacity",
                          filters.capacity === val ? "" : val
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.capacity === val
                          ? "bg-[#0B1F44] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {val || "Semua"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-xs font-medium text-gray-500">
                  Urutkan:
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="px-3 py-1.5 bg-gray-100 border-0 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#F5B21A]"
                >
                  <option value="">Terbaru</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#F5B21A] hover:text-[#d97706] font-medium ml-auto"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="h-52 shimmer" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 shimmer rounded w-3/4" />
                    <div className="h-4 shimmer rounded w-1/2" />
                    <div className="h-8 shimmer rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B1F44] mb-2">
                Mobil Tidak Ditemukan
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Tidak ada mobil yang sesuai dengan filter Anda.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] text-[#0B1F44] font-bold rounded-xl shadow-lg transition-all"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
