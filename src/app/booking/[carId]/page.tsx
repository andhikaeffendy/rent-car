"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Car } from "@/types";
import { formatPrice, formatDate, calculateDuration } from "@/lib/utils";
import { bookingSchema, BookingInput } from "@/lib/validations";
import { useAuth } from "@/lib/AuthContext";

function BookingContent() {
  const { carId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const serviceTypeParam = searchParams.get("serviceType") || "SELF_DRIVE";
  const initialTotal = parseFloat(searchParams.get("totalPrice") || "0");

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string>("");
  const [paymentPreview, setPaymentPreview] = useState<string>("");
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [error, setError] = useState("");

  const duration = calculateDuration(startDate, endDate);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: (serviceTypeParam as any) || "SELF_DRIVE",
      pickupMethod: "SELF_PICKUP",
      startDate,
      endDate,
      notes: "",
    },
  });

  const pickupMethod = watch("pickupMethod");
  const currentServiceType = watch("serviceType");

  useEffect(() => {
    if (carId) {
      fetch(`/api/cars/${carId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.car) setCar(data.car);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [carId]);

  function getPrice(): number {
    if (!car) return 0;
    if (
      currentServiceType === "WITH_DRIVER" &&
      car.priceWithDriver
    ) {
      return car.priceWithDriver;
    }
    return car.priceSelfDrive;
  }

  function getSubtotal(): number {
    return getPrice() * duration;
  }

  function getDeliveryFee(): number {
    return pickupMethod === "DELIVERY" ? 50000 : 0;
  }

  function getTotal(): number {
    return getSubtotal() + getDeliveryFee();
  }

  function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "ktp" | "payment"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    if (type === "ktp") {
      setKtpFile(file);
      setKtpPreview(URL.createObjectURL(file));
    } else {
      setPaymentFile(file);
      setPaymentPreview(URL.createObjectURL(file));
    }
  }

  async function onSubmitForm(data: BookingInput) {
    setError("");

    if (!ktpFile) {
      setError("Silakan upload foto KTP");
      return;
    }
    if (!paymentFile) {
      setError("Silakan upload bukti transfer");
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Create booking
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          serviceType: data.serviceType,
          pickupMethod: data.pickupMethod,
          pickupAddress: data.pickupAddress || null,
          startDate: data.startDate,
          endDate: data.endDate,
          notes: data.notes || null,
        }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        setError(bookingData.error || "Gagal membuat pesanan");
        setSubmitting(false);
        return;
      }

      const booking = bookingData.booking;

      // Step 2: Upload KTP
      const ktpFormData = new FormData();
      ktpFormData.append("file", ktpFile);
      const ktpRes = await fetch("/api/upload", {
        method: "POST",
        body: ktpFormData,
      });
      const ktpData = await ktpRes.json();

      if (ktpRes.ok) {
        // Save KTP document
        await fetch(`/api/bookings/${booking.id}/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ktpUrl: ktpData.url }),
        }).catch(() => {});
      }

      // Step 3: Upload payment proof
      const paymentFormData = new FormData();
      paymentFormData.append("file", paymentFile);
      const paymentRes = await fetch("/api/upload", {
        method: "POST",
        body: paymentFormData,
      });
      const paymentData = await paymentRes.json();

      if (paymentRes.ok) {
        // Create payment record
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking.id,
            amount: booking.totalPrice,
            transferProofUrl: paymentData.url,
          }),
        }).catch(() => {});
      }

      setCreatedBooking(booking);
    } catch (err) {
      setError("Terjadi kesalahan server");
    } finally {
      setSubmitting(false);
    }
  }

  // Redirect to login if not authenticated
  if (authLoading) {
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

  if (!user) {
    router.push(`/login?redirect=/booking/${carId}?${searchParams.toString()}`);
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500">Mengarahkan ke halaman login...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent mx-auto" />
        </div>
        <Footer />
      </>
    );
  }

  // Success screen
  if (createdBooking) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F44] mb-4">
              Terima Kasih!
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
              <p className="text-yellow-800 font-medium">
                Pesanan berhasil dibuat!
              </p>
              <p className="text-yellow-700 text-sm mt-2">
                Admin kami akan memverifikasi pembayaran Anda. Status akan berubah menjadi <strong>"Dikonfirmasi"</strong> setelah transfer diverifikasi.
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Mohon menyiapkan KTP asli saat pengambilan/pengantaran kendaraan.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">💳 Info Pembayaran</h3>
              <p className="text-blue-700 text-sm">Silakan transfer ke rekening berikut:</p>
              <div className="mt-2 space-y-1 text-sm text-blue-800">
                <p><strong>Bank BCA</strong></p>
                <p className="font-mono">123-456-7890</p>
                <p>a.n. Gilbert Sipahelut</p>
              </div>
              <p className="text-blue-600 text-xs mt-3">
                Jika sudah transfer, hubungi admin via WhatsApp untuk konfirmasi lebih cepat.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 text-left">
              <h3 className="font-semibold text-[#0B1F44] mb-3">
                Detail Booking
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kode Booking</span>
                  <span className="font-mono font-medium">{createdBooking.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mobil</span>
                  <span className="font-medium">{car?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="font-medium">
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-[#F5B21A]">
                    {formatPrice(createdBooking.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    Menunggu Verifikasi
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-xl transition-colors"
              >
                Lihat Dashboard
              </button>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285754650271"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Hubungi Admin
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Mobil Tidak Ditemukan</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-[#0B1F44] mb-2">
            Pemesanan Mobil
          </h1>
          <p className="text-gray-500 mb-8">{car.name}</p>

          {/* Steps indicator */}
          <div className="flex items-center space-x-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= s
                      ? "bg-[#F5B21A] text-[#0B1F44]"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`text-xs ml-1.5 ${
                    step >= s ? "text-[#0B1F44] font-medium" : "text-gray-400"
                  }`}
                >
                  {s === 1
                    ? "Layanan"
                    : s === 2
                    ? "Detail"
                    : s === 3
                    ? "Upload"
                    : "Konfirmasi"}
                </span>
                {s < 4 && (
                  <svg
                    className="w-4 h-4 mx-2 text-gray-300"
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
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Service Type */}
                {step === 1 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">
                      Pilih Jenis Layanan
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <label
                        className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                          currentServiceType === "SELF_DRIVE"
                            ? "border-[#F5B21A] bg-[#F5B21A]/5 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          value="SELF_DRIVE"
                          {...register("serviceType")}
                          className="sr-only"
                        />
                        <div className="text-3xl mb-2">🔑</div>
                        <h3 className="font-bold text-[#0B1F44]">
                          Lepas Kunci
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {car.priceSelfDrive
                            ? `${formatPrice(car.priceSelfDrive)}/hari`
                            : ""}
                        </p>
                        {currentServiceType === "SELF_DRIVE" && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-[#F5B21A] rounded-full flex items-center justify-center">
                            <svg
                              className="w-3.5 h-3.5 text-[#0B1F44]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </label>
                      <label
                        className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                          !car.priceWithDriver
                            ? "opacity-50 cursor-not-allowed"
                            : currentServiceType === "WITH_DRIVER"
                            ? "border-[#F5B21A] bg-[#F5B21A]/5 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          value="WITH_DRIVER"
                          {...register("serviceType")}
                          disabled={!car.priceWithDriver}
                          className="sr-only"
                        />
                        <div className="text-3xl mb-2">👨‍✈️</div>
                        <h3 className="font-bold text-[#0B1F44]">
                          Dengan Supir
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {car.priceWithDriver
                            ? `${formatPrice(car.priceWithDriver)}/hari`
                            : "Tidak tersedia"}
                        </p>
                        {currentServiceType === "WITH_DRIVER" && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-[#F5B21A] rounded-full flex items-center justify-center">
                            <svg
                              className="w-3.5 h-3.5 text-[#0B1F44]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.serviceType && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.serviceType.message}
                      </p>
                    )}
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-xl transition-colors"
                      >
                        Lanjutkan
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Pickup Method + Details */}
                {step === 2 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">
                      Metode Pengambilan & Detail
                    </h2>

                    <div className="space-y-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Metode Pengambilan
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label
                            className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                              pickupMethod === "SELF_PICKUP"
                                ? "border-[#F5B21A] bg-[#F5B21A]/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              value="SELF_PICKUP"
                              {...register("pickupMethod")}
                              className="sr-only"
                            />
                            <div className="text-2xl mb-1">🏢</div>
                            <h3 className="font-bold text-sm text-[#0B1F44]">
                              Ambil Sendiri
                            </h3>
                            <p className="text-xs text-gray-400">
                              Datang ke lokasi
                            </p>
                          </label>
                          <label
                            className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                              pickupMethod === "DELIVERY"
                                ? "border-[#F5B21A] bg-[#F5B21A]/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              value="DELIVERY"
                              {...register("pickupMethod")}
                              className="sr-only"
                            />
                            <div className="text-2xl mb-1">🚚</div>
                            <h3 className="font-bold text-sm text-[#0B1F44]">
                              Diantar
                            </h3>
                            <p className="text-xs text-gray-400">
                              +Rp50.000 biaya antar
                            </p>
                          </label>
                        </div>
                      </div>

                      {pickupMethod === "DELIVERY" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat Pengantaran
                          </label>
                          <textarea
                            {...register("pickupAddress")}
                            rows={2}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
                            placeholder="Masukkan alamat lengkap..."
                          />
                          {errors.pickupAddress && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.pickupAddress.message}
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catatan Tambahan
                        </label>
                        <textarea
                          {...register("notes")}
                          rows={2}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]"
                          placeholder="Catatan untuk pemesanan (opsional)"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                      >
                        Kembali
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 px-6 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-xl transition-colors"
                      >
                        Lanjutkan
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Upload Documents */}
                {step === 3 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">
                      Upload Dokumen
                    </h2>

                    <div className="space-y-6">
                      {/* KTP Upload */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Foto KTP
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#F5B21A] transition-colors">
                          {ktpPreview ? (
                            <div className="space-y-3">
                              <img
                                src={ktpPreview}
                                alt="KTP Preview"
                                className="max-h-48 mx-auto rounded-xl"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setKtpFile(null);
                                  setKtpPreview("");
                                }}
                                className="text-xs text-red-500 hover:text-red-700"
                              >
                                Hapus
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
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
                              <p className="text-sm text-gray-600 font-medium">
                                Klik untuk upload KTP
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Format: JPG, PNG. Maks: 5MB
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e, "ktp")
                                }
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-4 border border-blue-100">
                        <h3 className="font-semibold text-blue-800 text-sm mb-2">💳 Info Transfer</h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-blue-700"><strong>Bank BCA</strong> — 123-456-7890</p>
                          <p className="text-blue-600">a.n. <strong>Gilbert Sipahelut</strong></p>
                          <p className="text-blue-500 text-xs mt-1">Silakan transfer sesuai total di atas, lalu upload buktinya di bawah.</p>
                        </div>
                      </div>

                      {/* Payment Proof Upload */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Bukti Transfer Pembayaran
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#F5B21A] transition-colors">
                          {paymentPreview ? (
                            <div className="space-y-3">
                              <img
                                src={paymentPreview}
                                alt="Payment Preview"
                                className="max-h-48 mx-auto rounded-xl"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPaymentFile(null);
                                  setPaymentPreview("");
                                }}
                                className="text-xs text-red-500 hover:text-red-700"
                              >
                                Hapus
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
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
                              <p className="text-sm text-gray-600 font-medium">
                                Klik untuk upload bukti transfer
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Format: JPG, PNG. Maks: 5MB
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e, "payment")
                                }
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                      >
                        Kembali
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        disabled={!ktpFile || !paymentFile}
                        className="flex-1 px-6 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] disabled:bg-gray-300 text-white disabled:text-gray-500 font-medium rounded-xl transition-colors"
                      >
                        Lanjutkan
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">
                      Konfirmasi Pemesanan
                    </h2>

                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-medium text-[#0B1F44] mb-3">
                          Ringkasan Pesanan
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Mobil</span>
                            <span className="font-medium">{car.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Layanan</span>
                            <span className="font-medium">
                              {watch("serviceType") === "SELF_DRIVE"
                                ? "Lepas Kunci"
                                : "Dengan Supir"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Metode Pengambilan
                            </span>
                            <span className="font-medium">
                              {watch("pickupMethod") === "SELF_PICKUP"
                                ? "Ambil Sendiri"
                                : "Diantar"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Tanggal
                            </span>
                            <span className="font-medium">
                              {formatDate(startDate)} - {formatDate(endDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Durasi</span>
                            <span className="font-medium">
                              {duration} hari
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-medium text-[#0B1F44] mb-3">
                          Rincian Biaya
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Harga {watch("serviceType") === "SELF_DRIVE" ? "Lepas Kunci" : "Dengan Supir"}
                            </span>
                            <span className="font-medium">
                              {formatPrice(getPrice())} x {duration} hari
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">
                              {formatPrice(getSubtotal())}
                            </span>
                          </div>
                          {getDeliveryFee() > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">
                                Biaya Antar
                              </span>
                              <span className="font-medium">
                                {formatPrice(getDeliveryFee())}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                            <span className="text-[#0B1F44]">
                              Total Pembayaran
                            </span>
                            <span className="text-[#F5B21A]">
                              {formatPrice(getTotal())}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                        <p className="font-medium mb-1">Info Penting:</p>
                        <ul className="space-y-1 text-blue-600">
                          <li>✓ KTP asli wajib diserahkan saat pengambilan/pengantaran</li>
                          <li>✓ Transfer ke rekening BCA: <strong>123-456-7890</strong> a.n. <strong>Gilbert Sipahelut</strong></li>
                          <li>✓ Upload bukti transfer di halaman upload dokumen</li>
                          <li>✓ Pesanan akan diverifikasi oleh admin setelah bukti transfer diterima</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] hover:from-[#d97706] hover:to-[#b45309] disabled:from-gray-300 disabled:to-gray-300 text-[#0B1F44] disabled:text-gray-500 font-bold rounded-xl transition-colors shadow-sm"
                      >
                        {submitting
                          ? "Memproses..."
                          : "Konfirmasi & Kirim"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right - Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h3 className="font-semibold text-[#0B1F44] mb-4">
                    Ringkasan Pesanan
                  </h3>
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-[#0B1F44]">{car.name}</p>
                      <p className="text-xs text-gray-500">
                        {car.transmission} · {car.capacity} Kursi
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tanggal</span>
                      <span className="font-medium text-xs text-right">
                        {formatDate(startDate)}
                        <br />
                        {formatDate(endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Durasi</span>
                      <span className="font-medium">{duration} hari</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">
                        {formatPrice(getSubtotal())}
                      </span>
                    </div>
                    {getDeliveryFee() > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Biaya Antar</span>
                        <span className="font-medium">
                          {formatPrice(getDeliveryFee())}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100">
                      <span className="text-[#0B1F44]">Total</span>
                      <span className="text-[#F5B21A]">
                        {formatPrice(getTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent mx-auto" />
        </div>
      }
    >
      <BookingContent />
      <WhatsAppFloat />
    </Suspense>
  );
}
