"use client";
import { useState, useEffect, useCallback } from "react";
import StatusBadge from "@/components/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";

interface BookingItem {
  id: string; bookingCode: string; status: string; serviceType: string;
  pickupMethod: string; pickupAddress: string | null; deliveryPhone: string | null;
  paymentMethod: string; startDate: string; endDate: string; duration: number;
  subtotal: number; deliveryFee: number; totalPrice: number; notes: string | null;
  createdAt: string;
  car: { name: string; imageUrl: string; transmission: string };
  user: { name: string; email: string; phone: string } | null;
  payments: { id: string; amount: number; transferProofUrl: string; status: string }[];
  documents: { id: string; ktpUrl: string }[];
}

const STATUS_OPTIONS = [
  { value: "", label: "Semua", color: "bg-gray-100 text-gray-600" },
  { value: "WAITING_PAYMENT", label: "Menunggu Bayar", color: "bg-yellow-100 text-yellow-700" },
  { value: "WAITING_VERIFICATION", label: "Menunggu Verif", color: "bg-orange-100 text-orange-700" },
  { value: "CONFIRMED", label: "Dikonfirmasi", color: "bg-green-100 text-green-700" },
  { value: "ON_RENT", label: "Sedang Disewa", color: "bg-blue-100 text-blue-700" },
  { value: "COMPLETED", label: "Selesai", color: "bg-gray-100 text-gray-600" },
  { value: "REJECTED", label: "Ditolak", color: "bg-red-100 text-red-700" },
  { value: "CANCELLED", label: "Dibatalkan", color: "bg-pink-100 text-pink-700" },
];

const SERVICE_LABELS: Record<string,string> = { SELF_DRIVE: "Lepas Kunci", WITH_DRIVER: "Dengan Supir" };
const PICKUP_LABELS: Record<string,string> = { SELF_PICKUP: "Ambil Sendiri", DELIVERY: "Diantar" };

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<BookingItem | null>(null);
  const [actionLoading, setActionLoading] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter ? "?status=" + filter : "";
      const res = await fetch("/api/bookings" + params);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {} finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function updateStatus(id: string, status: string) {
    if (!confirm("Yakin ingin mengubah status ini?")) return;
    setActionLoading(id);
    try {
      const res = await fetch("/api/bookings/" + id, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
        if (selected?.id === id) setSelected({ ...selected, status });
      } else alert("Gagal update status");
    } catch { alert("Gagal update status"); }
    finally { setActionLoading(""); }
  }

  return (
    <div>
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setFilter(opt.value)}
              className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (
                filter === opt.value ? "bg-[#0B1F44] text-white shadow-sm" : opt.color + " hover:bg-gray-200"
              )}
            >{opt.label}</button>
          ))}
        </div>
        <p className="text-xs text-gray-400 whitespace-nowrap">{bookings.length} pesanan</p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-4 animate-pulse">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2"><div className="w-40 h-4 bg-gray-200 rounded" /><div className="w-24 h-3 bg-gray-200 rounded" /></div>
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-semibold text-[#0B1F44] mb-1">Belum Ada Pesanan</h3>
          <p className="text-sm text-gray-400">Tidak ada pesanan dengan status ini.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Kode / Customer</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Kendaraan</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelected(bk)}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#0B1F44]">{bk.bookingCode}</p>
                      <p className="text-xs text-gray-400">{bk.user?.name || "Guest"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {bk.car?.imageUrl ? <img src={bk.car.imageUrl} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div>
                          <p className="font-medium text-[#0B1F44]">{bk.car?.name || "—"}</p>
                          <p className="text-xs text-gray-400">{SERVICE_LABELS[bk.serviceType] || bk.serviceType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm">{formatDate(bk.startDate)}</p>
                      <p className="text-xs text-gray-400">{bk.duration} hari</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0B1F44]">{formatPrice(bk.totalPrice)}</p>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={bk.status} type="booking" /></td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(bk); }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-50">
            {bookings.map((bk) => (
              <div key={bk.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(bk)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#0B1F44] text-sm">{bk.bookingCode}</span>
                  <StatusBadge status={bk.status} type="booking" />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">{bk.car?.name || "—"}</span>
                  <span className="text-xs text-gray-400">&bull; {bk.duration} hari</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{bk.user?.name || "Guest"}</span>
                  <span className="font-semibold text-[#0B1F44] text-sm">{formatPrice(bk.totalPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4" onClick={() => setSelected(null)}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="font-bold text-[#0B1F44]">{selected.bookingCode}</h2>
                <p className="text-xs text-gray-400">Detail Pesanan</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status + Payment */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Status</p>
                  <StatusBadge status={selected.status} type="booking" />
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Pembayaran</p>
                  <p className="font-medium text-sm">{selected.paymentMethod === "TUNAI" ? "Tunai" : "Transfer"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Layanan</p>
                  <p className="font-medium text-sm">{SERVICE_LABELS[selected.serviceType] || selected.serviceType}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Pengambilan</p>
                  <p className="font-medium text-sm">{PICKUP_LABELS[selected.pickupMethod] || selected.pickupMethod}</p>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-[#0B1F44] text-sm mb-3">Data Customer</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400 text-xs">Nama</span><p className="font-medium">{selected.user?.name || "—"}</p></div>
                  <div><span className="text-gray-400 text-xs">Email</span><p className="font-medium">{selected.user?.email || "—"}</p></div>
                  <div><span className="text-gray-400 text-xs">Telepon</span><p className="font-medium">{selected.user?.phone || "—"}</p></div>
                  {selected.deliveryPhone && <div><span className="text-gray-400 text-xs">HP Delivery</span><p className="font-medium">{selected.deliveryPhone}</p></div>}
                </div>
              </div>

              {/* Kendaraan */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-[#0B1F44] text-sm mb-3">Kendaraan</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-xl bg-white overflow-hidden">
                    {selected.car?.imageUrl ? <img src={selected.car.imageUrl} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div>
                    <p className="font-medium text-[#0B1F44]">{selected.car?.name || "—"}</p>
                    <p className="text-xs text-gray-400">{selected.car?.transmission || ""} &bull; {SERVICE_LABELS[selected.serviceType]}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {(selected.documents?.length > 0 || selected.payments?.length > 0) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-[#0B1F44] text-sm mb-3">Dokumen</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selected.documents?.map((doc) => (
                      <div key={doc.id}>
                        <p className="text-xs text-gray-400 mb-1">Foto KTP</p>
                        <a href={doc.ktpUrl} target="_blank" className="text-sm text-blue-600 hover:underline truncate block">{doc.ktpUrl.slice(0, 40)}...</a>
                      </div>
                    ))}
                    {selected.payments?.filter(p => p.transferProofUrl).map((pay) => (
                      <div key={pay.id}>
                        <p className="text-xs text-gray-400 mb-1">Bukti Transfer</p>
                        <a href={pay.transferProofUrl} target="_blank" className="text-sm text-blue-600 hover:underline truncate block">{pay.transferProofUrl.slice(0, 40)}...</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-[#0B1F44] text-sm mb-3">Rincian Biaya</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Harga Sewa</span><span className="font-medium">{formatPrice(selected.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Biaya Antar</span><span className="font-medium">{selected.deliveryFee > 0 ? formatPrice(selected.deliveryFee) : "Gratis"}</span></div>
                  <div className="flex justify-between border-t border-gray-200 pt-2"><span className="font-bold text-[#0B1F44]">Total</span><span className="font-bold text-[#F5B21A] text-lg">{formatPrice(selected.totalPrice)}</span></div>
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <p className="text-xs text-yellow-700 font-medium mb-1">Catatan Customer</p>
                  <p className="text-sm text-yellow-800">{selected.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {selected.status === "WAITING_VERIFICATION" && (
                  <>
                    <button onClick={() => updateStatus(selected.id, "CONFIRMED")} disabled={actionLoading === selected.id}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all shadow-sm">
                      {actionLoading === selected.id ? "Memproses..." : "Konfirmasi"}
                    </button>
                    <button onClick={() => updateStatus(selected.id, "REJECTED")} disabled={actionLoading === selected.id}
                      className="px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all">
                      Tolak
                    </button>
                  </>
                )}
                {(selected.status === "CONFIRMED" || selected.status === "ON_RENT") && (
                  <button onClick={() => updateStatus(selected.id, "COMPLETED")} disabled={actionLoading === selected.id}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all">
                    Selesaikan
                  </button>
                )}
                <button onClick={() => setSelected(null)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-xl text-sm transition-all">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
