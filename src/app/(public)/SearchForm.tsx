"use client";

import { useState, useEffect } from "react";

interface Location {
  id: string;
  city: string;
  slug: string;
}

interface CarType {
  id: string;
  name: string;
  slug: string;
}

export default function SearchForm() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [carTypes, setCarTypes] = useState<CarType[]>([]);

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d.locations)) setLocations(d.locations);
      })
      .catch(() => {});

    fetch("/api/car-types")
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d.carTypes)) setCarTypes(d.carTypes);
      })
      .catch(() => {});
  }, []);

  return (
    <form action="/cars" method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
      <div className="sm:col-span-1">
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Lokasi
        </label>
        <select
          name="locationId"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        >
          <option value="">Semua Lokasi</option>
          {(locations || []).map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.city}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Mulai
        </label>
        <input
          type="date"
          name="startDate"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Selesai
        </label>
        <input
          type="date"
          name="endDate"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Tipe Mobil
        </label>
        <select
          name="typeId"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        >
          <option value="">Semua Tipe</option>
          {(carTypes || []).map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-navy-900 font-bold rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-200"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Cari Mobil</span>
          </span>
        </button>
      </div>
    </form>
  );
}
