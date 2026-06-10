"use client";

export default function SearchForm() {
  return (
    <form action="/cars" method="GET" className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Mulai
        </label>
        <input
          type="date"
          name="startDate"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Selesai
        </label>
        <input
          type="date"
          name="endDate"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Cari
        </label>
        <input
          type="text"
          name="search"
          placeholder="Nama mobil..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A] transition-colors"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] hover:from-[#d97706] hover:to-[#b45309] text-[#0B1F44] font-bold rounded-xl shadow-lg shadow-[#F5B21A]/20 hover:shadow-xl hover:shadow-[#F5B21A]/30 transition-all duration-200"
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
