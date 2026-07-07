"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCarPage() {
  const router = useRouter();
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    transmission: "AT",
    type: "MOBIL",
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
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

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

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload gagal");
    }
    const data = await res.json();
    return data.url;
  }

  async function handleMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      setImagePreview(URL.createObjectURL(file));
    } catch (err: any) {
      setError(err.message || "Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    const urls: string[] = [];
    const previews: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          setError("Ukuran file maksimal 5MB per gambar");
          continue;
        }
        const url = await uploadFile(file);
        urls.push(url);
        previews.push(URL.createObjectURL(file));
      }
      setGalleryUrls((prev) => [...prev, ...urls]);
      setGalleryPreviews((prev) => [...prev, ...previews]);
    } catch (err: any) {
      setError(err.message || "Gagal upload gambar galeri");
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryImage(index: number) {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.imageUrl) {
      setError("Silakan upload gambar utama");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          galleryUrls,
        }),
      });

      if (res.ok) {
        router.push("/admin/cars");
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menambah kendaraan");
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
          <span>Kembali ke daftar kendaraan</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#0B1F44] mt-2">
          Tambah Kendaraan Baru
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
          {/* Nama */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Kendaraan
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Avanza Terbaru"
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

          {/* Tipe Kendaraan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Kendaraan
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] bg-white"
            >
              <option value="MOBIL">Mobil</option>
              <option value="MOTOR">Motor</option>
            </select>
          </div>

          {/* Transmisi & Kapasitas */}
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

          {/* Bahan Bakar & Tahun */}
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

          {/* Warna & Status */}
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

          {/* Harga */}
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
            <p className="text-xs text-gray-400 mb-2">{form.type === "MOTOR" ? "Motor tidak tersedia dengan supir" : "Isi jika tersedia"}</p>
            <input
              type="number"
              name="priceWithDriver" disabled={form.type === "MOTOR"}
              value={form.priceWithDriver}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ada"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>

          {/* IMAGE UPLOAD - Main Image */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar Utama (upload langsung)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#F5B21A] transition-colors">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-56 mx-auto rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setForm((prev) => ({ ...prev, imageUrl: "" }));
                      if (mainImageRef.current) mainImageRef.current.value = "";
                    }}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Hapus gambar
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">
                    Klik untuk upload gambar utama
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Format: JPG, PNG, WebP. Maks: 5MB
                  </p>
                  <input
                    ref={mainImageRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleMainImage}
                  />
                </label>
              )}
            </div>
            {uploading && (
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Mengupload...
              </p>
            )}
          </div>

          {/* GALLERY UPLOAD */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Galeri Gambar (upload langsung, opsional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#F5B21A] transition-colors">
              <label className="cursor-pointer block">
                <svg
                  className="w-10 h-10 mx-auto mb-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-600 font-medium">
                  Klik untuk upload gambar galeri
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Format: JPG, PNG, WebP. Maks: 5MB per gambar. Bisa pilih banyak sekaligus.
                </p>
                <input
                  ref={galleryRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleGalleryImages}
                />
              </label>
            </div>
            {galleryPreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {galleryPreviews.map((preview, i) => (
                  <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={preview} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deskripsi */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Deskripsi kendaraan..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>

          {/* Fasilitas */}
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
            disabled={submitting || uploading}
            className="flex-1 py-3 bg-[#F5B21A] hover:bg-[#d97706] disabled:bg-gray-300 text-[#0B1F44] font-bold rounded-xl transition-colors shadow-sm"
          >
            {submitting ? "Menyimpan..." : uploading ? "Mengupload..." : "Simpan Kendaraan"}
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
