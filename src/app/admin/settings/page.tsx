"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    rentalName: "Agil Rental Mobil",
    address: "Jl. Dr. Malaihollo, Benteng, Ambon (depan Warung Padang Talago Intan)",
    openingHours: "Senin-Sabtu 08.00-21.00 WIT, Minggu 10.00-21.00 WIT",
    phone1: "0857-5465-0271",
    phone2: "0821-7911-7882",
    instagram: "@agil.rental.ambon",
    facebook: "Gilbert Sipahelut",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setForm({
          rentalName: data.settings.rentalName || form.rentalName,
          address: data.settings.address || form.address,
          openingHours: data.settings.openingHours || form.openingHours,
          phone1: data.settings.phone1 || form.phone1,
          phone2: data.settings.phone2 || form.phone2,
          instagram: data.settings.instagram || form.instagram,
          facebook: data.settings.facebook || form.facebook,
        });
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan pengaturan");
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
        <h1 className="text-2xl font-bold text-[#0B1F44]">
          Pengaturan Profil Rental
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola informasi dan kontak Agil Rental Mobil
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Pengaturan berhasil disimpan!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Rental
            </label>
            <input
              type="text"
              name="rentalName"
              required
              value={form.rentalName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              name="address"
              required
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jam Operasional
            </label>
            <input
              type="text"
              name="openingHours"
              required
              value={form.openingHours}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon 1 (Admin)
            </label>
            <input
              type="text"
              name="phone1"
              required
              value={form.phone1}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon 2
            </label>
            <input
              type="text"
              name="phone2"
              value={form.phone2}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="text"
              name="facebook"
              value={form.facebook}
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
            {submitting ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
