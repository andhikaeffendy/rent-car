"use client";
import { useState, useEffect } from "react";

const TABS = [
  { id: "general", label: "Informasi Umum" },
  { id: "bank", label: "Informasi Bank" },
  { id: "logo", label: "Logo" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState({
    rentalName: "", address: "", openingHours: "", phone1: "", phone2: "", instagram: "", facebook: "",
    bankName: "", bankAccountNumber: "", bankAccountName: "", logoUrl: "",
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings").then(r=>r.json()).then(d => {
      const s = d.settings || {};
      setForm(prev => ({...prev, ...s}));
      if (s.logoUrl) setLogoPreview(s.logoUrl);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) { setLogoPreview(data.url); setForm(prev => ({...prev, logoUrl: data.url})); }
      else alert("Gagal upload");
    } catch { alert("Gagal"); } finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({...form, logoUrl: logoPreview}),
      });
      if (res.ok) alert("Pengaturan berhasil disimpan!");
      else alert("Gagal menyimpan");
    } catch { alert("Gagal"); } finally { setSubmitting(false); }
  }

  function upd(field: string, value: string) { setForm(prev => ({...prev, [field]: value})); }

  if (loading) return <div className="space-y-4 animate-pulse"><div className="flex space-x-2 mb-6"><div className="w-32 h-10 bg-slate-100 rounded-lg" /><div className="w-32 h-10 bg-slate-100 rounded-lg" /><div className="w-24 h-10 bg-slate-100 rounded-lg" /></div><div className="bg-white rounded-xl border border-slate-200 p-6"><div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg" />)}</div></div></div>;

  return (
    <div>
      <p className="text-sm font-semibold text-slate-900 mb-4">Pengaturan</p>
      <div className="flex space-x-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={"px-4 py-2 rounded-md text-sm font-medium transition-all " + (activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900")}>{tab.label}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        {activeTab === "general" && (
          <div className="grid sm:grid-cols-2 gap-5">
            {["rentalName","address","openingHours","phone1","phone2","instagram","facebook"].map(f => (
              <div key={f} className={f === "address" ? "sm:col-span-2" : ""}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 capitalize">{f === "rentalName" ? "Nama Rental" : f === "openingHours" ? "Jam Operasional" : f}</label>
                <input type="text" value={(form as any)[f] || ""} onChange={e => upd(f, e.target.value)} className="input-field" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "bank" && (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4"><p className="text-sm text-amber-800 font-medium">Informasi Bank</p><p className="text-xs text-amber-600 mt-0.5">Data ini akan ditampilkan di halaman booking saat customer memilih pembayaran Transfer.</p></div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Bank</label><input type="text" value={form.bankName} onChange={e => upd("bankName", e.target.value)} className="input-field" placeholder="Contoh: Bank Mandiri" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">No. Rekening</label><input type="text" value={form.bankAccountNumber} onChange={e => upd("bankAccountNumber", e.target.value)} className="input-field" placeholder="123-00-87654321" /></div>
              <div className="sm:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1.5">Atas Nama</label><input type="text" value={form.bankAccountName} onChange={e => upd("bankAccountName", e.target.value)} className="input-field" placeholder="Agil Rental" /></div>
            </div>
          </div>
        )}

        {activeTab === "logo" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Logo</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
                {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" /> : <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              </div>
              <div>
                <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium cursor-pointer transition-colors inline-block">
                  {uploading ? "Mengupload..." : "Pilih Gambar"}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
                </label>
                <p className="text-xs text-slate-400 mt-1">Format: JPG, PNG, WebP. Maks 5MB.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">Perubahan langsung diterapkan</p>
          <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition-all disabled:opacity-50 shadow-sm">
            {submitting ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
