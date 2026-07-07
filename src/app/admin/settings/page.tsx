"use client";
import { useState, useEffect } from "react";
import { api, apiUpload } from "@/lib/api/client";

const TABS = [
  { id: "general", label: "Informasi Umum" },
  { id: "bank", label: "Informasi Bank" },
  { id: "logo", label: "Logo & Tampilan" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [mainForm, setMainForm] = useState({
    rentalName: "", address: "", openingHours: "", phone1: "", phone2: "",
    instagram: "", facebook: "",
    bankName: "", bankAccountNumber: "", bankAccountName: "",
    logoUrl: "",
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => {
        const s = d.settings || {};
        setMainForm(prev => ({ ...prev, ...s }));
        if (s.logoUrl) setLogoPreview(s.logoUrl);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await apiUpload("/api/upload", file);
      setLogoPreview(data.url);
      setMainForm(prev => ({ ...prev, logoUrl: data.url }));
    } catch { alert("Gagal upload"); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...mainForm, logoUrl: logoPreview }),
      });
      if (res.ok) alert("Pengaturan berhasil disimpan!");
      else alert("Gagal menyimpan");
    } catch { alert("Gagal menyimpan"); }
    finally { setSubmitting(false); }
  }

  function update(field: string, value: string) {
    setMainForm(prev => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex space-x-2 mb-6"><div className="w-32 h-10 bg-gray-200 rounded-xl" /><div className="w-32 h-10 bg-gray-200 rounded-xl" /><div className="w-40 h-10 bg-gray-200 rounded-xl" /></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6"><div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-200 rounded-xl" />)}</div></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#0B1F44]">Pengaturan</h2>
        <p className="text-xs text-gray-400">Kelola informasi rental</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={"px-4 py-2 rounded-lg text-sm font-medium transition-all " + (
              activeTab === tab.id ? "bg-white text-[#0B1F44] shadow-sm" : "text-gray-500 hover:text-[#0B1F44]"
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {/* Tab: General */}
        {activeTab === "general" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Rental</label>
                <input type="text" value={mainForm.rentalName} onChange={e => update("rentalName", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat</label>
                <input type="text" value={mainForm.address} onChange={e => update("address", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jam Operasional</label>
                <input type="text" value={mainForm.openingHours} onChange={e => update("openingHours", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telepon 1</label>
                <input type="text" value={mainForm.phone1} onChange={e => update("phone1", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telepon 2</label>
                <input type="text" value={mainForm.phone2} onChange={e => update("phone2", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                <input type="text" value={mainForm.instagram} onChange={e => update("instagram", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook</label>
                <input type="text" value={mainForm.facebook} onChange={e => update("facebook", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Bank */}
        {activeTab === "bank" && (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
              <p className="text-sm text-amber-800 font-medium">Informasi Bank</p>
              <p className="text-xs text-amber-600 mt-0.5">Data ini akan ditampilkan di halaman booking saat customer memilih pembayaran Transfer.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Bank</label>
                <input type="text" value={mainForm.bankName} onChange={e => update("bankName", e.target.value)} placeholder="Contoh: Bank Mandiri"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Rekening</label>
                <input type="text" value={mainForm.bankAccountNumber} onChange={e => update("bankAccountNumber", e.target.value)} placeholder="Contoh: 123-00-87654321"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Atas Nama</label>
                <input type="text" value={mainForm.bankAccountName} onChange={e => update("bankAccountName", e.target.value)} placeholder="Contoh: Agil Rental Mobil"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]/20 focus:border-[#F5B21A] outline-none transition-all" />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Logo */}
        {activeTab === "logo" && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Logo</label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <label className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium cursor-pointer transition-colors inline-block">
                    {uploading ? "Mengupload..." : "Pilih Gambar"}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
                  </label>
                  <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG, WebP. Maks 5MB.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">Perubahan akan langsung diterapkan di seluruh halaman</p>
          <button type="submit" disabled={submitting}
            className="px-6 py-2.5 bg-gradient-to-r from-[#F5B21A] to-amber-500 hover:from-amber-500 hover:to-[#F5B21A] text-white font-medium rounded-xl text-sm transition-all disabled:opacity-50 shadow-sm">
            {submitting ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
