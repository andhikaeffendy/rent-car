"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    logoUrl: "",
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [mainForm, setMainForm] = useState({
    rentalName: "Agil Rental Mobil",
    address: "Jl. Dr. Malaihollo, Benteng, Ambon (depan Warung Padang Talago Intan)",
    openingHours: "Senin-Sabtu 08.00-21.00 WIT, Minggu 10.00-21.00 WIT",
    phone1: "0857-5465-0271",
    phone2: "0821-7911-7882",
    instagram: "@agil.rental.ambon",
    facebook: "Gilbert Sipahelut",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

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

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }
    setUploadingLogo(true);
    setError("");
    try {
      const url = await uploadFile(file);
      setForm((prev) => ({ ...prev, logoUrl: url }));
      setLogoPreview(URL.createObjectURL(file));
    } catch (err: any) {
      setError(err.message || "Gagal upload logo");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setForm({ logoUrl: data.settings.logoUrl || "" });
        if (data.settings.logoUrl) setLogoPreview(data.settings.logoUrl);
        setMainForm({
          rentalName: data.settings.rentalName || mainForm.rentalName,
          address: data.settings.address || mainForm.address,
          openingHours: data.settings.openingHours || mainForm.openingHours,
          phone1: data.settings.phone1 || mainForm.phone1,
          phone2: data.settings.phone2 || mainForm.phone2,
          instagram: data.settings.instagram || mainForm.instagram,
          facebook: data.settings.facebook || mainForm.facebook,
          bankName: data.settings.bankName || mainForm.bankName,
          bankAccountNumber: data.settings.bankAccountNumber || mainForm.bankAccountNumber,
          bankAccountName: data.settings.bankAccountName || mainForm.bankAccountName,
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
    setMainForm((prev) => ({ ...prev, [name]: value }));
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
        body: JSON.stringify({ ...mainForm, logoUrl: form.logoUrl }),
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
          {/* Logo Upload */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo Rental
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#F5B21A] transition-colors">
              {logoPreview ? (
                <div className="space-y-3">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-h-32 mx-auto rounded-xl object-contain"
                  />
                  <div className="flex space-x-3 justify-center">
                    <label className="cursor-pointer text-xs text-[#0F5EF7] hover:text-blue-800">
                      Ganti logo
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => { setLogoPreview(""); setForm((prev) => ({ ...prev, logoUrl: "" })); }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">Upload logo rental</p>
                  <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG, WebP. Maks: 5MB</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              )}
            </div>
            {uploadingLogo && (
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Mengupload...
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Rental
            </label>
            <input
              type="text"
              name="rentalName"
              required
              value={mainForm.rentalName}
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
              value={mainForm.address}
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
              value={mainForm.openingHours}
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
              value={mainForm.phone1}
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
              value={mainForm.phone2}
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
              value={mainForm.instagram}
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
              value={mainForm.facebook}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
            />
          </div>
        </div>

        {/* Bank Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">Informasi Rekening Bank</h2>
          <p className="text-sm text-gray-500 mb-4">Data rekening yang ditampilkan saat customer memilih pembayaran Transfer</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
              <input
                type="text"
                name="bankName"
                value={mainForm.bankName}
                onChange={handleChange}
                placeholder="Bank Mandiri"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Rekening</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={mainForm.bankAccountNumber}
                onChange={handleChange}
                placeholder="123-00-87654321"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
              <input
                type="text"
                name="bankAccountName"
                value={mainForm.bankAccountName}
                onChange={handleChange}
                placeholder="Agil Rental Mobil"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
              />
            </div>
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
