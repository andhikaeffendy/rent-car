"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.json())
      .then(d => { setPayments(d.bookings?.filter((b: any) => b.payments?.length) || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#0B1F44]">Pembayaran</h2>
        <p className="text-xs text-gray-400">{payments.length} pembayaran</p>
      </div>
      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-[#0B1F44]">Belum Ada Pembayaran</h3>
          <p className="text-sm text-gray-400 mt-1">Tidak ada data pembayaran.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Kode Booking</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Metode</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Jumlah</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#0B1F44] text-xs uppercase tracking-wider">Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((bk: any) => (
                  <tr key={bk.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 font-medium text-[#0B1F44]">{bk.bookingCode}</td>
                    <td className="px-5 py-4"><span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100">{bk.paymentMethod}</span></td>
                    <td className="px-5 py-4 font-medium">{formatPrice(bk.totalPrice)}</td>
                    <td className="px-5 py-4"><StatusBadge status={bk.status} type="booking" /></td>
                    <td className="px-5 py-4">
                      {bk.payments?.filter((p: any) => p.transferProofUrl).map((p: any) => (
                        <a key={p.id} href={p.transferProofUrl} target="_blank" className="text-blue-600 hover:underline text-xs">Lihat Bukti</a>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
