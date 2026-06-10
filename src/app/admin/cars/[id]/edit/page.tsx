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
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
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
        setImagePreview(c.imageUrl);
        setGalleryUrls(c.galleryUrls || []);
        setGalleryPreviews(c.galleryUrls || []);
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
    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) continue;
        const url = await uploadFile(file);
        setGalleryUrls((prev) => [...prev, url]);
        setGalleryPreviews((prev) => [...prev, URL.createObjectURL(file)]);
      }
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
    setSubmitting(true);

    try {
      const res = await fetch(`/api/cars/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, galleryUrls }),
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

          {/* IMAGE UPLOAD - Main */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar Utama
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#F5B21A] transition-colors">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-56 mx-auto rounded-xl object-cover"
                  />
                  <label className="cursor-pointer inline-flex items-center space-x-2 text-xs text-[#0F5EF7] hover:text-blue-800">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Ganti gambar</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleMainImage}
                    />
                  </label>
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
                  <p className="text-sm text-gray-600 font-medium">Upload gambar</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleMainImage}
                  />
                </label>
              )}
            </div>
          </div>

          {/* GALLERY UPLOAD */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Galeri Gambar
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
                <p className="text-sm text-gray-600 font-medium">Upload gambar galeri</p>
                <p className="text-xs text-gray-400 mt-1">Bisa pilih banyak sekaligus</p>
                <input
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
            {submitting ? "Menyimpan..." : uploading ? "Mengupload..." : "Simpan Perubahan"}
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
