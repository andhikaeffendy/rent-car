"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    transmission: "AT",
    capacity: "5",
    fuelType: "Bensin",
    year: "2024",
    color: "",
    priceSelfDrive: "",
    priceWithDriver: "",
    imageUrl: "",
    description: "",
    facilities: "",
    status: "AVAILABLE",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name"
        ? {
            slug: value
              .toLowerCase()
              .replace(/[^\w\s]/g, "")
              .replace(/\s+/g, "-"),
          }
        : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/cars");
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menambah mobil");
      }
    } catch {
      setError("Terjadi kesalahan server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/cars"
          className="text-sm text-gray-500 hover:text-[#0B1F44] flex items-center space-x-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Kembali ke daftar mobil</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#0B1F44] mt-2">
          Tambah Mobil Baru
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Mobil
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Avanza Terbaru"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              required
              value={form.slug}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A] bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transmisi
            </label>
            <select
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            >
              <option value="AT">Matic (AT)</option>
              <option value="MT">Manual (MT)</option>
              <option value="AT/MT">AT/MT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kapasitas
            </label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bahan Bakar
            </label>
            <select
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            >
              <option value="Bensin">Bensin</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Listrik">Listrik</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun
            </label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warna
            </label>
            <input
              type="text"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Putih, Hitam, dll"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            >
              <option value="AVAILABLE">Tersedia</option>
              <option value="MAINTENANCE">Perawatan</option>
              <option value="UNAVAILABLE">Tidak Tersedia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga Lepas Kunci (per hari)
            </label>
            <input
              type="number"
              name="priceSelfDrive"
              required
              value={form.priceSelfDrive}
              onChange={handleChange}
              placeholder="350000"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga Dengan Supir (opsional)
            </label>
            <input
              type="number"
              name="priceWithDriver"
              value={form.priceWithDriver}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ada"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Gambar
            </label>
            <input
              type="url"
              name="imageUrl"
              required
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Deskripsi mobil..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fasilitas (pisahkan dengan koma)
            </label>
            <input
              type="text"
              name="facilities"
              value={form.facilities}
              onChange={handleChange}
              placeholder="AC, Audio Bluetooth, Kunci Sentral, Airbag"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 bg-[#F5B21A] hover:bg-[#d97706] disabled:bg-gray-300 text-[#0B1F44] font-bold rounded-xl transition-colors shadow-sm"
          >
            {submitting ? "Menyimpan..." : "Simpan Mobil"}
          </button>
          <Link
            href="/admin/cars"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-center"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
