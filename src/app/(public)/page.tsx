import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PopularCars from "@/components/PopularCars";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-[#0B1F44] via-[#0B2B6E] to-[#0B1F44] overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=1920&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F44] via-[#0B1F44]/50 to-transparent" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#F5B21A]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-[#F5B21A]/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Agil Rental Mobil — Ambon</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
                  Sewa Mobil di Ambon{" "}
                  <span className="gradient-text">Mudah & Terpercaya</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-xl">
                  Nikmati perjalanan Anda di Kota Ambon dengan layanan rental mobil terpercaya.
                  Proses cepat, harga transparan, tersedia lepas kunci atau dengan supir.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/cars"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] hover:from-[#d97706] hover:to-[#b45309] text-[#0B1F44] font-bold rounded-2xl shadow-xl shadow-[#F5B21A]/20 hover:shadow-2xl hover:shadow-[#F5B21A]/30 transition-all duration-200 text-lg"
                  >
                    Cari Mobil
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </Link>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285754650271"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white font-medium rounded-2xl transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Hubungi Admin
                  </a>
                </div>

                <div className="flex items-center space-x-6 mt-12">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B1F44] bg-gray-200 overflow-hidden">
                        <img
                          src={`https://images.unsplash.com/photo-${
                            i === 1 ? "1633332755192-727a05c4013d" :
                            i === 2 ? "1494790108377-be9c29b29330" :
                            i === 3 ? "1507003211169-0a1dd7228f2d" :
                            "1534528741775-53994a69daeb"
                          }?w=100&q=80`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">100+ Pelanggan Puas</p>
                    <div className="flex items-center space-x-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-[#F5B21A]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-400 ml-1">(4.9 rata-rata rating)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="w-[450px] h-[550px] rounded-3xl overflow-hidden shadow-2xl shadow-[#F5B21A]/10 border border-white/10">
                    <img
                      src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=90"
                      alt="Agil Rental Mobil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-8 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/20 min-w-[180px]">
                    <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
                    <p className="text-2xl font-bold text-[#0B1F44]">Rp350K</p>
                    <p className="text-xs text-gray-400">per hari</p>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0B1F44]">6 Mobil</p>
                        <p className="text-xs text-gray-400">Siap pakai</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICES SECTION ===== */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-[#F5B21A]/15 text-[#b45309] text-xs font-semibold rounded-full mb-4">LAYANAN</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F44] mb-4">Layanan Kami</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Agil Rental Mobil menyediakan berbagai layanan untuk memenuhi kebutuhan perjalanan Anda di Ambon
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: "🔑", title: "Lepas Kunci", desc: "Sewa mobil tanpa sopir, bebas kemana saja" },
                { icon: "👨‍✈️", title: "Dengan Supir", desc: "Supir profesional dan berpengalaman" },
                { icon: "🚚", title: "Antar Jemput", desc: "Unit diantar ke lokasi Anda" },
                { icon: "💼", title: "Perjalanan Dinas", desc: "Untuk kebutuhan bisnis dan dinas" },
                { icon: "🏖️", title: "Tour Kota", desc: "Jelajahi Ambon dengan nyaman" },
                { icon: "✈️", title: "Drop Off/Pick Up", desc: "Antar jemput bandara" },
              ].map((service, i) => (
                <div key={i} className="group bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">{service.icon}</div>
                  <h3 className="font-bold text-[#0B1F44] text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-400">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FLEET SECTION ===== */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <span className="inline-block px-4 py-1.5 bg-[#F5B21A]/15 text-[#b45309] text-xs font-semibold rounded-full mb-4">ARMADA</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F44]">Mobil Tersedia</h2>
                <p className="text-gray-500 mt-2">Pilihan mobil terbaik untuk perjalanan Anda</p>
              </div>
              <Link
                href="/cars"
                className="hidden sm:inline-flex items-center px-5 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-2xl transition-all duration-200 mt-4 md:mt-0"
              >
                Lihat Semua Mobil
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>

            <PopularCars />

            <div className="text-center sm:hidden mt-8">
              <Link href="/cars" className="inline-flex items-center px-6 py-3 bg-[#0B1F44] text-white font-medium rounded-2xl">
                Lihat Semua Mobil
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== WHY US SECTION ===== */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-[#F5B21A]/15 text-[#b45309] text-xs font-semibold rounded-full mb-4">KEUNGGULAN</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F44] mb-4">Mengapa Memilih Agil Rental?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Kami berkomitmen memberikan layanan terbaik untuk perjalanan Anda di Ambon</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "📋", title: "Proses Mudah", desc: "Pesan mobil dalam hitungan menit, tanpa ribet", bg: "from-blue-500 to-indigo-600" },
                { icon: "💰", title: "Harga Transparan", desc: "Harga jelas tanpa biaya tersembunyi", bg: "from-emerald-500 to-teal-600" },
                { icon: "🚗", title: "Armada Terawat", desc: "Mobil terawat, bersih, dan siap pakai", bg: "from-orange-500 to-red-500" },
                { icon: "🛡️", title: "Aman & Terpercaya", desc: "Layanan ramah dan profesional", bg: "from-purple-500 to-pink-600" },
              ].map((benefit, i) => (
                <div key={i} className="group bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 mb-5 bg-gradient-to-br ${benefit.bg} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold text-[#0B1F44] text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== LOCATION & CONTACT SECTION ===== */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-[#F5B21A]/15 text-[#b45309] text-xs font-semibold rounded-full mb-4">LOKASI & KONTAK</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F44] mb-6">Temukan Kami</h2>
                <div className="space-y-5">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0B1F44]/5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#F5B21A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0B1F44]">Alamat</h3>
                      <p className="text-gray-500 text-sm mt-1">Jl. Dr. Malaihollo, Benteng, Ambon</p>
                      <p className="text-gray-400 text-xs">(depan Warung Padang Talago Intan)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0B1F44]/5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#F5B21A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0B1F44]">Telepon</h3>
                      <p className="text-gray-500 text-sm mt-1">0857-5465-0271 (Priscil/Admin)</p>
                      <p className="text-gray-400 text-sm">0821-7911-7882</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0B1F44]/5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#F5B21A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0B1F44]">Jam Operasional</h3>
                      <p className="text-gray-500 text-sm mt-1">Senin - Sabtu: 08.00 - 21.00 WIT</p>
                      <p className="text-gray-400 text-sm">Minggu: 10.00 - 21.00 WIT</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0B1F44]/5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#F5B21A]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0B1F44]">Media Sosial</h3>
                      <p className="text-gray-500 text-sm mt-1">Instagram: @agil.rental.ambon</p>
                      <p className="text-gray-400 text-sm">Facebook: Gilbert Sipahelut</p>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285754650271"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Hubungi via WhatsApp
                </a>
              </div>
              <div className="bg-gray-100 rounded-2xl h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="font-medium text-gray-500">Jl. Dr. Malaihollo, Benteng, Ambon</p>
                  <p className="text-sm text-gray-400 mt-1">Depan Warung Padang Talago Intan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section className="relative py-20 bg-gradient-to-br from-[#0B1F44] via-[#0B2B6E] to-[#0B1F44] overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=1920&q=80')] bg-cover bg-center opacity-5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {[
                { value: "6", label: "Mobil Tersedia", icon: "🚗" },
                { value: "100+", label: "Pelanggan Puas", icon: "😊" },
                { value: "1", label: "Kota (Ambon)", icon: "🏙️" },
                { value: "4.9", label: "Rating", icon: "⭐" },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 inline-block">{stat.icon}</div>
                  <div className="text-4xl lg:text-5xl font-bold text-[#F5B21A] mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F44] mb-4">
              Siap untuk Perjalanan Anda?
            </h2>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-lg">
              Pesan mobil sekarang dan nikmati perjalanan yang nyaman di Kota Ambon.
              Proses cepat, mudah, dan harga terbaik untuk Anda.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/cars"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] hover:from-[#d97706] hover:to-[#b45309] text-[#0B1F44] font-bold rounded-2xl shadow-xl shadow-[#F5B21A]/20 hover:shadow-2xl transition-all duration-200 text-lg"
              >
                Pesan Mobil Sekarang
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285754650271"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 hover:border-[#F5B21A] text-[#0B1F44] font-semibold rounded-2xl transition-all duration-200"
              >
                Hubungi Admin
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
