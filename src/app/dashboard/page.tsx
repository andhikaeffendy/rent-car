"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useAuth } from "@/lib/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
        return;
      }
      fetchBookings();
    }
  }, [user, authLoading]);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings/user");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0B1F44]">
              Selamat Datang, {user?.name || "User"}!
            </h1>
            <p className="text-gray-500 mt-1">
              Kelola pemesanan kendaraan Anda di Agil Rental Mobil
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5">
              <div className="text-lg sm:text-2xl mb-1">📋</div>
              <p className="text-[10px] sm:text-sm text-gray-500">Total</p>
              <p className="text-base sm:text-2xl font-bold text-[#0B1F44] mt-0.5">
                {bookings.length}
              </p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5">
              <div className="text-lg sm:text-2xl mb-1">⏳</div>
              <p className="text-[10px] sm:text-sm text-gray-500">Aktif</p>
              <p className="text-base sm:text-2xl font-bold text-[#F5B21A] mt-0.5">
                {
                  bookings.filter(
                    (b: any) =>
                      b.status === "WAITING_PAYMENT" ||
                      b.status === "WAITING_VERIFICATION" ||
                      b.status === "CONFIRMED"
                  ).length
                }
              </p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5">
              <div className="text-lg sm:text-2xl mb-1">✅</div>
              <p className="text-[10px] sm:text-sm text-gray-500">Selesai</p>
              <p className="text-base sm:text-2xl font-bold text-green-600 mt-0.5">
                {
                  bookings.filter((b: any) => b.status === "COMPLETED")
                    .length
                }
              </p>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#0B1F44]">
                Riwayat Pemesanan
              </h2>
              <Link
                href="/cars"
                className="text-xs text-[#F5B21A] hover:text-[#d97706] font-medium"
              >
                + Pesan Baru
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">
                  Belum ada pemesanan
                </p>
                <Link
                  href="/cars"
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] text-[#0B1F44] font-bold rounded-xl transition-all"
                >
                  Pesan Kendaraan Sekarang
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {bookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="p-5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                          <img
                            src={booking.car?.imageUrl}
                            alt={booking.car?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-[#0B1F44]">
                              {booking.car?.name}
                            </h3>
                            <span className="font-mono text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                              {booking.bookingCode}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.startDate).toLocaleDateString(
                              "id-ID"
                            )}{" "}
                            -{" "}
                            {new Date(booking.endDate).toLocaleDateString(
                              "id-ID"
                            )}{" "}
                            · {booking.duration} hari
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {booking.serviceType === "SELF_DRIVE"
                              ? "Lepas Kunci"
                              : "Dengan Supir"}{" "}
                            ·{" "}
                            {booking.pickupMethod === "SELF_PICKUP"
                              ? "Ambil Sendiri"
                              : "Diantar"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={booking.status} />
                        <p className="text-sm font-bold text-[#F5B21A] mt-1">
                          Rp {booking.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">
                  Butuh Bantuan?
                </h3>
                <p className="text-emerald-100 text-sm mt-1">
                  Hubungi admin Agil Rental Mobil via WhatsApp
                </p>
              </div>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285754650271"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg inline-flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hubungi Admin
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
