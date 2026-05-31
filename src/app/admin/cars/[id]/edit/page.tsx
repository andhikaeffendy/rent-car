"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCar();
  }, []);

  async function fetchCar() {
    try {
      const res = await fetch(`/api/cars/${params.id}`);
      const data = await res.json();
      if (data.car) {
        const c = data.car;
        setForm({
          name: c.name,
          slug: c.slug,
          transmission: c.transmission,
          capacity: c.capacity.toString(),
          fuelType: c.fuelType,
          year: c.year.toString(),
          color: c.color || "",
          priceSelfDrive: c.priceSelfDrive.toString(),
          priceWithDriver: c.priceWithDriver?.toString() || "",
          imageUrl: c.imageUrl,
          description: c.description || "",
          facilities: (c.facilities || []).join(", "),
          status: c.status,
        });
      }
    } catch {
      setError("Gagal memuat data mobil");
    } finally {
      setLoading(false);
    }
  }

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
      const res = await fetch(`/api/cars/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/cars");
      } else {
        const data = await res.json();
        setError(data.error || "Gagal mengupdate mobil");
      }
    } catch {
      setError("Terjadi kesalahan server");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" />
      </div>
    );
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
          Edit Mobil: {form.name}
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
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
              Harga Lepas Kunci
            </label>
            <input
              type="number"
              name="priceSelfDrive"
              required
              value={form.priceSelfDrive}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga Dengan Supir
            </label>
            <input
              type="number"
              name="priceWithDriver"
              value={form.priceWithDriver}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div className="sm:col-span-2">
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
              <option value="RENTED">Disewa</option>
              <option value="MAINTENANCE">Perawatan</option>
              <option value="UNAVAILABLE">Tidak Tersedia</option>
            </select>
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
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
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
