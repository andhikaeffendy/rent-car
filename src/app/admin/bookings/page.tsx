"use client";
import { useState, useEffect, useCallback } from "react";
import StatusBadge from "@/components/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";

interface BookingItem {
  id: string; bookingCode: string; status: string; serviceType: string;
  pickupMethod: string; pickupAddress: string | null; deliveryPhone: string | null;
  paymentMethod: string; startDate: string; endDate: string; duration: number;
  subtotal: number; deliveryFee: number; totalPrice: number; notes: string | null; createdAt: string;
  car: { name: string; imageUrl: string; transmission: string };
  user: { name: string; email: string; phone: string } | null;
  payments: { id: string; amount: number; transferProofUrl: string; status: string }[];
  documents: { id: string; ktpUrl: string }[];
}

const FILTERS = [
  { value: "", label: "Semua", color: "bg-slate-100 text-slate-600" },
  { value: "WAITING_VERIFICATION", label: "Perlu Verif", color: "bg-orange-50 text-orange-600" },
  { value: "CONFIRMED", label: "Dikonfirmasi", color: "bg-emerald-50 text-emerald-600" },
  { value: "ON_RENT", label: "Berjalan", color: "bg-blue-50 text-blue-600" },
  { value: "COMPLETED", label: "Selesai", color: "bg-slate-100 text-slate-500" },
  { value: "REJECTED", label: "Ditolak", color: "bg-red-50 text-red-500" },
];

const SVCLABEL: Record<string,string> = { SELF_DRIVE: "Lepas Kunci", WITH_DRIVER: "Dengan Supir" };
const PICKLABEL: Record<string,string> = { SELF_PICKUP: "Ambil Sendiri", DELIVERY: "Diantar" };

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<BookingItem | null>(null);
  const [actionLoading, setActionLoading] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings" + (filter ? "?status=" + filter : ""));
      setBookings((await res.json()).bookings || []);
    } catch {} finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function updateStatus(id: string, status: string) {
    if (!confirm("Yakin?")) return;
    setActionLoading(id);
    try {
      const res = await fetch("/api/bookings/" + id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (res.ok) { setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b)); if (selected?.id === id) setSelected({ ...selected, status }); }
      else alert("Gagal");
    } catch { alert("Gagal"); } finally { setActionLoading(""); }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(opt => (
          <button key={opt.value} onClick={() => setFilter(opt.value)}
            className={"px-4 py-1.5 rounded-full text-xs font-medium transition-all " + (filter === opt.value ? "bg-slate-900 text-white shadow-sm" : opt.color + " hover:bg-slate-200")}>{opt.label}</button>
        ))}
        <span className="text-xs text-slate-400 self-center ml-auto">{bookings.length} pesanan</span>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-4 animate-pulse">{[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center space-x-4"><div className="w-12 h-12 bg-slate-100 rounded-lg" /><div className="flex-1 space-y-2"><div className="w-40 h-4 bg-slate-100 rounded" /><div className="w-24 h-3 bg-slate-100 rounded" /></div><div className="w-20 h-6 bg-slate-100 rounded-full" /></div>
          ))}</div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Belum Ada Pesanan</h3>
          <p className="text-sm text-slate-400">Tidak ada pesanan dengan filter ini.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Kode / Customer</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Kendaraan</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Tanggal</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Total</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Status</th>
                <th className="px-5 py-3.5 text-right"></th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 20).map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => setSelected(bk)}>
                    <td className="px-5 py-4"><p className="font-medium text-slate-900">{bk.bookingCode}</p><p className="text-xs text-slate-400">{bk.user?.name || "Guest"}</p></td>
                    <td className="px-5 py-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">{bk.car?.imageUrl ? <img src={bk.car.imageUrl} alt="" className="w-full h-full object-cover" /> : null}</div><div><p className="font-medium text-slate-900">{bk.car?.name || "—"}</p><p className="text-xs text-slate-400">{SVCLABEL[bk.serviceType] || bk.serviceType}</p></div></div></td>
                    <td className="px-5 py-4"><p className="text-slate-700">{formatDate(bk.startDate)}</p><p className="text-xs text-slate-400">{bk.duration} hari</p></td>
                    <td className="px-5 py-4"><p className="font-semibold text-slate-900">{formatPrice(bk.totalPrice)}</p></td>
                    <td className="px-5 py-4"><StatusBadge status={bk.status} /></td>
                    <td className="px-5 py-4 text-right"><button onClick={(e) => { e.stopPropagation(); setSelected(bk); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">Detail</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden divide-y divide-slate-100">
            {bookings.map((bk) => (
              <div key={bk.id} className="p-4 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(bk)}>
                <div className="flex items-center justify-between mb-2"><span className="font-medium text-slate-900 text-sm">{bk.bookingCode}</span><StatusBadge status={bk.status} /></div>
                <div className="flex items-center space-x-2 mb-2"><span className="text-sm font-medium text-slate-700">{bk.car?.name || "—"}</span><span className="text-xs text-slate-400">&bull; {bk.duration} hari</span></div>
                <div className="flex justify-between"><span className="text-xs text-slate-400">{bk.user?.name || "Guest"}</span><span className="font-semibold text-slate-900 text-sm">{formatPrice(bk.totalPrice)}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4" onClick={() => setSelected(null)}>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md" />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div><h2 className="font-bold text-slate-900">{selected.bookingCode}</h2><p className="text-xs text-slate-400">Detail Pesanan</p></div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{l:"Status",v:<StatusBadge status={selected.status} />},{l:"Pembayaran",v:selected.paymentMethod === "TUNAI" ? "Tunai" : "Transfer"},{l:"Layanan",v:SVCLABEL[selected.serviceType] || selected.serviceType},{l:"Pengambilan",v:PICKLABEL[selected.pickupMethod] || selected.pickupMethod}].map((d,i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-400 mb-0.5">{d.l}</p><div className="font-medium text-sm text-slate-800">{d.v}</div></div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-lg p-4"><h3 className="font-semibold text-slate-900 text-sm mb-3">Data Customer</h3>
                <div className="grid grid-cols-2 gap-3 text-sm"><div><span className="text-slate-400 text-xs">Nama</span><p className="font-medium text-slate-800">{selected.user?.name || "—"}</p></div><div><span className="text-slate-400 text-xs">Email</span><p className="font-medium text-slate-800">{selected.user?.email || "—"}</p></div><div><span className="text-slate-400 text-xs">Telepon</span><p className="font-medium text-slate-800">{selected.user?.phone || "—"}</p></div>{selected.deliveryPhone && <div><span className="text-slate-400 text-xs">HP Delivery</span><p className="font-medium text-slate-800">{selected.deliveryPhone}</p></div>}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4"><h3 className="font-semibold text-slate-900 text-sm mb-3">Rincian Biaya</h3>
                <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-medium text-slate-800">{formatPrice(selected.subtotal)}</span></div><div className="flex justify-between"><span className="text-slate-500">Biaya Antar</span><span className="font-medium text-slate-800">{selected.deliveryFee > 0 ? formatPrice(selected.deliveryFee) : "Gratis"}</span></div><div className="flex justify-between border-t border-slate-200 pt-2 mt-2"><span className="font-bold text-slate-900">Total</span><span className="font-bold text-amber-600 text-lg">{formatPrice(selected.totalPrice)}</span></div></div>
              </div>
              {selected.notes && <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4"><p className="text-xs text-yellow-700 font-medium mb-1">Catatan</p><p className="text-sm text-yellow-800">{selected.notes}</p></div>}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {selected.status === "WAITING_VERIFICATION" && (<>
                  <button onClick={() => updateStatus(selected.id, "CONFIRMED")} disabled={actionLoading === selected.id} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-all shadow-sm">{actionLoading === selected.id ? "..." : "Konfirmasi"}</button>
                  <button onClick={() => updateStatus(selected.id, "REJECTED")} disabled={actionLoading === selected.id} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm transition-all">Tolak</button>
                </>)}
                {(selected.status === "CONFIRMED" || selected.status === "ON_RENT") && (
                  <button onClick={() => updateStatus(selected.id, "COMPLETED")} disabled={actionLoading === selected.id} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-all">Selesaikan</button>
                )}
                <button onClick={() => setSelected(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm transition-all">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
