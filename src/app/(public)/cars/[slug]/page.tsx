"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Car } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

export default function CarDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [serviceType, setServiceType] = useState<"SELF_DRIVE" | "WITH_DRIVER">(
    "SELF_DRIVE"
  );

  useEffect(() => {
    fetchCar();
  }, [slug]);

  async function fetchCar() {
    try {
      const res = await fetch(`/api/cars/${slug}`);
      const data = await res.json();
      if (data.car) setCar(data.car);
    } catch {} finally {
      setLoading(false);
    }
  }

  function getPrice(): number {
    if (!car) return 0;
    if (serviceType === "WITH_DRIVER" && car.priceWithDriver) {
      return car.priceWithDriver;
    }
    return car.priceSelfDrive;
  }

  function getDuration(): number {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
    return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
  }

  function handleBooking() {
    if (!startDate || !endDate) {
      alert("Silakan pilih tanggal mulai dan selesai");
      return;
    }
    if (!user) {
      const price = getPrice();
      const duration = getDuration();
      const total = price * duration;
      const redirect = encodeURIComponent(
        `/booking/${car?.id}?startDate=${startDate}&endDate=${endDate}&serviceType=${serviceType}&totalPrice=${total}`
      );
      router.push(`/login?redirect=${redirect}`);
      return;
    }
    const price = getPrice();
    const duration = getDuration();
    const total = price * duration;
    router.push(
      `/booking/${car?.id}?startDate=${startDate}&endDate=${endDate}&serviceType=${serviceType}&totalPrice=${total}`
    );
  }

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285754650271";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Agil Rental Mobil, saya tertarik dengan ${car?.name || "mobil"}. Apakah tersedia untuk disewa?`
  )}`;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-96 bg-gray-200 rounded-2xl" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-[#0B1F44] mb-2">
            Mobil Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mb-6">
            Mobil yang Anda cari tidak tersedia.
          </p>
          <Link
            href="/cars"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] text-[#0B1F44] font-bold rounded-2xl"
          >
            Kembali ke Daftar Mobil
          </Link>
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
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#F5B21A]">
              Beranda
            </Link>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link href="/cars" className="hover:text-[#F5B21A]">
              Mobil
            </Link>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-[#0B1F44] font-medium truncate">
              {car.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Image & Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image + Gallery */}
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm ${
                      car.status === "AVAILABLE"
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {car.status === "AVAILABLE" ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                </div>
              </div>

              {/* Gallery thumbnails */}
              {car.galleryUrls && car.galleryUrls.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {car.galleryUrls.map((url, i) => (
                    <div
                      key={i}
                      className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200"
                    >
                      <img
                        src={url}
                        alt={`${car.name} - ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Car Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F44] mb-2">
                      {car.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-[#F5B21A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{car.transmission}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-[#F5B21A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{car.capacity} Kursi</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Transmisi", value: car.transmission },
                    { label: "Kapasitas", value: `${car.capacity} Kursi` },
                    { label: "Tahun", value: car.year.toString() },
                    { label: "Bahan Bakar", value: car.fuelType },
                    { label: "Warna", value: car.color || "-" },
                  ].map((spec, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-3"
                    >
                      <p className="text-xs text-gray-500 mb-0.5">
                        {spec.label}
                      </p>
                      <p className="font-semibold text-[#0B1F44] text-sm">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {car.description && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-[#0B1F44] text-lg mb-3">
                      Deskripsi
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {car.description}
                    </p>
                  </div>
                )}

                {/* Facilities */}
                {car.facilities && car.facilities.length > 0 && (
                  <div className="pt-6 border-t border-gray-100 mt-6">
                    <h3 className="font-semibold text-[#0B1F44] text-lg mb-3">
                      Fasilitas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {car.facilities.map((facility, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-[#0B1F44]/5 text-[#0B1F44] rounded-xl text-xs font-medium"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                {/* Service Type Selection */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                    Pilih Layanan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setServiceType("SELF_DRIVE")}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        serviceType === "SELF_DRIVE"
                          ? "bg-[#0B1F44] text-white shadow-sm"
                          : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      Lepas Kunci
                    </button>
                    <button
                      onClick={() => setServiceType("WITH_DRIVER")}
                      disabled={!car.priceWithDriver}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        serviceType === "WITH_DRIVER"
                          ? "bg-[#0B1F44] text-white shadow-sm"
                          : car.priceWithDriver
                          ? "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Dengan Supir
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-center mb-6 pb-6 border-b border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Harga {serviceType === "SELF_DRIVE" ? "Lepas Kunci" : "Dengan Supir"}
                  </p>
                  <p className="text-3xl font-bold text-[#F5B21A]">
                    {formatPrice(getPrice())}
                  </p>
                  <p className="text-sm text-gray-400">per hari</p>
                </div>

                {/* Date Selection */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
                    />
                  </div>

                  {startDate && endDate && (
                    <div className="bg-gradient-to-r from-[#F5B21A]/10 to-[#f59e0b]/10 rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600">
                          Durasi Sewa
                        </span>
                        <span className="font-bold text-[#0B1F44] text-lg">
                          {getDuration()} Hari
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-[#F5B21A]/20">
                        <span className="text-sm font-semibold text-[#0B1F44]">
                          Total Harga
                        </span>
                        <span className="text-2xl font-bold text-[#F5B21A]">
                          {formatPrice(getPrice() * getDuration())}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleBooking}
                  disabled={car.status !== "AVAILABLE"}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] hover:from-[#d97706] hover:to-[#b45309] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-[#0B1F44] font-bold rounded-2xl shadow-lg shadow-[#F5B21A]/20 hover:shadow-xl transition-all duration-200 mb-3"
                >
                  {car.status === "AVAILABLE"
                    ? "Pesan Sekarang"
                    : "Mobil Tidak Tersedia"}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center py-3.5 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
