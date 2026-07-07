  "use client";
import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Car, RentalSetting } from "@/types";
import { formatPrice, formatDate, calculateDuration } from "@/lib/utils";
import { bookingSchema, BookingInput } from "@/lib/validations";
import { useAuth } from "@/lib/AuthContext";

function BookingContent() {
  const { carId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const startDateParam = searchParams.get("startDate") || "";
  const endDateParam = searchParams.get("endDate") || "";

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState("");
  const [paymentPreview, setPaymentPreview] = useState("");
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<RentalSetting | null>(null);
  const [pickupMethod, setPickupMethod] = useState("SELF_PICKUP");
  const [paymentMethod, setPaymentMethod] = useState("TRANSFER");
  const [startDate, setStartDate] = useState(startDateParam);
  const [endDate, setEndDate] = useState(endDateParam);

  const duration = calculateDuration(startDate, endDate);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: "SELF_DRIVE" as any,
      pickupMethod: "SELF_PICKUP",
      paymentMethod: "TRANSFER",
      startDate: startDateParam,
      endDate: endDateParam,
    },
  });

  const currentServiceType = watch("serviceType");

  useEffect(() => {
    if (!carId) return;
    fetch("/api/cars/" + carId)
      .then((r) => r.json())
      .then((data) => {
        if (data.car) {
          setCar(data.car);
          if (data.car.type === "MOTOR") {
            setValue("serviceType", "SELF_DRIVE");
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [carId, setValue]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      const redirect = encodeURIComponent(window.location.pathname + window.location.search);
      router.push("/login?redirect=" + redirect);
    }
  }, [user, authLoading, router]);

  const currentPrice =
    currentServiceType === "WITH_DRIVER" && car?.priceWithDriver
      ? car.priceWithDriver
      : car?.priceSelfDrive || 0;
  const subtotal = currentPrice * duration;
  const deliveryFee = pickupMethod === "DELIVERY" ? 50000 : 0;
  const totalPrice = subtotal + deliveryFee;

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url || "";
  }

  async function onSubmitForm(data: BookingInput) {
    setSubmitting(true);
    setError("");

    try {
      let ktpUrl = "";
      if (ktpFile) {
        ktpUrl = await uploadFile(ktpFile);
      }

      let paymentUrl = "";
      if (paymentMethod === "TRANSFER" && paymentFile) {
        paymentUrl = await uploadFile(paymentFile);
      }

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          serviceType: car?.type === "MOTOR" ? "SELF_DRIVE" : data.serviceType,
          pickupMethod: data.pickupMethod,
          pickupAddress: data.pickupAddress || null,
          deliveryPhone: data.deliveryPhone || null,
          paymentMethod,
          startDate,
          endDate,
          notes: data.notes || null,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        setError(bookingData.error || "Gagal membuat pemesanan");
        setSubmitting(false);
        return;
      }

      const booking = bookingData.booking;

      if (ktpUrl && booking.id) {
        await fetch("/api/bookings/" + booking.id + "/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ktpUrl }),
        });
      }

      if (paymentUrl && booking.id) {
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking.id,
            amount: totalPrice,
            transferProofUrl: paymentUrl,
          }),
        });
      }

      setCreatedBooking(booking);
    } catch {
      setError("Terjadi kesalahan saat memproses pemesanan");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#F5B21A] border-t-transparent" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Kendaraan tidak ditemukan</p>
          <a href="/cars" className="text-[#F5B21A] mt-2 inline-block">Kembali ke daftar</a>
        </div>
      </div>
    );
  }

  if (createdBooking) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-gray-50 py-12">
          <div className="max-w-lg mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#0B1F44] mb-2">Pesanan Berhasil Dibuat!</h1>
              <p className="text-gray-500 mb-6">Status: <span className="font-medium text-[#F5B21A]">Menunggu Konfirmasi Admin</span></p>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kode Booking</span>
                  <span className="font-bold text-[#0B1F44]">{createdBooking.bookingCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{car.type === "MOTOR" ? "Motor" : "Mobil"}</span>
                  <span className="font-medium">{car.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="font-medium">{formatDate(startDate)} - {formatDate(endDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-[#F5B21A]">{formatPrice(totalPrice)}</span>
                </div>
                {paymentMethod === "TUNAI" && (
                  <div className="bg-blue-50 rounded-lg p-2 text-xs text-blue-700 mt-2">
                    Pembayaran Tunai — lakukan pembayaran saat pengambilan/pengantaran
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/dashboard" className="flex-1 px-6 py-3 bg-[#0B1F44] text-white font-medium rounded-xl text-center hover:bg-[#0B2B6E] transition-colors">
                  Lihat Pesanan Saya
                </a>
                <a href="/cars" className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl text-center hover:bg-gray-200 transition-colors">
                  Sewa Lagi
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

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <img src={car.imageUrl} alt={car.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
            <div>
              <h1 className="text-xl font-bold text-[#0B1F44]">{car.name}</h1>
              <p className="text-sm text-gray-500">
                {car.type === "MOTOR" ? "Motor" : "Mobil"} &bull; {car.transmission} &bull; {car.capacity} Kursi &bull; {car.fuelType}
              </p>
            </div>
          </div>

          <div className="flex items-center mb-8 overflow-x-auto pb-2">
            {[
              { num: 1, label: "Tanggal" },
              { num: 2, label: car?.type === "MOTOR" ? "Pengambilan" : "Layanan" },
              { num: 3, label: "Detail" },
              { num: 4, label: "Bayar" },
              { num: 5, label: "KTP" },
              { num: 6, label: "Konfirmasi" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex items-center space-x-1.5">
                  <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold " + (step >= s.num ? "bg-[#F5B21A] text-[#0B1F44]" : "bg-gray-100 text-gray-400")}>
                    {s.num}
                  </div>
                  <span className={"text-xs whitespace-nowrap " + (step >= s.num ? "text-[#0B1F44] font-medium" : "text-gray-400")}>
                    {s.label}
                  </span>
                </div>
                {i < 5 && (
                  <svg className="w-4 h-4 mx-1.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">

                {step === 1 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">Pilih Tanggal Sewa</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                        <input type="date" value={startDate}
                          onChange={(e) => { setStartDate(e.target.value); setValue("startDate", e.target.value); }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A] transition-colors"
                          min={new Date().toISOString().split("T")[0]} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                        <input type="date" value={endDate}
                          onChange={(e) => { setEndDate(e.target.value); setValue("endDate", e.target.value); }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A] transition-colors"
                          min={startDate || new Date().toISOString().split("T")[0]} />
                      </div>
                    </div>
                    {startDate && endDate && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Durasi: <strong>{duration} hari</strong></p>
                      </div>
                    )}
                    <div className="mt-6 flex justify-end">
                      <button type="button" onClick={() => {
                        if (!startDate || !endDate) { setError("Pilih tanggal mulai dan selesai terlebih dahulu"); return; }
                        if (new Date(endDate) <= new Date(startDate)) { setError("Tanggal selesai harus setelah tanggal mulai"); return; }
                        setError("");
                        if (car.type === "MOTOR") { setStep(3); } else { setStep(2); }
                      }} className="px-6 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-xl transition-colors">
                        Lanjutkan
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && car.type !== "MOTOR" && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">Pilih Jenis Layanan</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {["SELF_DRIVE", "WITH_DRIVER"].map((type) => {
                        const isSelected = currentServiceType === type;
                        const disabled = type === "WITH_DRIVER" && !car.priceWithDriver;
                        return (
                          <label key={type} className={"relative border-2 rounded-2xl p-5 cursor-pointer transition-all " + (disabled ? "opacity-50 cursor-not-allowed" : isSelected ? "border-[#F5B21A] bg-[#F5B21A]/5 shadow-sm" : "border-gray-200 hover:border-gray-300")}>
                            <input type="radio" value={type} {...register("serviceType")} disabled={disabled} className="sr-only" />
                            <div className="text-3xl mb-2">{type === "SELF_DRIVE" ? "[Kunci]" : "[+Supir]"}</div>
                            <h3 className="font-bold text-[#0B1F44]">{type === "SELF_DRIVE" ? "Lepas Kunci" : "Dengan Supir"}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {type === "SELF_DRIVE" ? formatPrice(car.priceSelfDrive) + "/hari" : car.priceWithDriver ? formatPrice(car.priceWithDriver) + "/hari" : "Tidak tersedia"}
                            </p>
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-[#F5B21A] rounded-full flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-[#0B1F44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </label>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex justify-between">
                      <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">Kembali</button>
                      <button type="button" onClick={() => setStep(3)} className="px-6 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-xl transition-colors">Lanjutkan</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">Metode Pengambilan</h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        {["SELF_PICKUP", "DELIVERY"].map((m) => (
                          <label key={m} className={"relative border-2 rounded-xl p-4 cursor-pointer transition-all " + (pickupMethod === m ? "border-[#F5B21A] bg-[#F5B21A]/5" : "border-gray-200 hover:border-gray-300")}>
                            <input type="radio" value={m} {...register("pickupMethod")} className="sr-only" onChange={() => setPickupMethod(m)} />
                            <div className="text-2xl mb-1">{m === "SELF_PICKUP" ? "[Ambil]" : "[Antar]"}</div>
                            <h3 className="font-bold text-sm text-[#0B1F44]">{m === "SELF_PICKUP" ? "Ambil Sendiri" : "Diantar"}</h3>
                            <p className="text-xs text-gray-400">{m === "SELF_PICKUP" ? "Datang ke lokasi" : "+Rp50.000 biaya antar"}</p>
                          </label>
                        ))}
                      </div>
                      {pickupMethod === "DELIVERY" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pengantaran</label>
                            <textarea {...register("pickupAddress")} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]" placeholder="Masukkan alamat lengkap..." />
                            {errors.pickupAddress && <p className="text-red-500 text-xs mt-1">{errors.pickupAddress.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. HP untuk Pengantaran</label>
                            <input type="tel" {...register("deliveryPhone")} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]" placeholder="0857-5465-0271" />
                            {errors.deliveryPhone && <p className="text-red-500 text-xs mt-1">{errors.deliveryPhone.message}</p>}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                        <textarea {...register("notes")} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F5B21A]" placeholder="Catatan untuk pemesanan (opsional)" />
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <button type="button" onClick={() => setStep(car?.type === "MOTOR" ? 1 : 2)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">Kembali</button>
                      <button type="button" onClick={() => setStep(4)} className="px-6 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-xl transition-colors">Lanjutkan</button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">Metode Pembayaran</h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        {["TRANSFER", "TUNAI"].map((pm) => (
                          <label key={pm} className={"relative border-2 rounded-xl p-4 cursor-pointer transition-all " + (paymentMethod === pm ? "border-[#F5B21A] bg-[#F5B21A]/5" : "border-gray-200 hover:border-gray-300")}>
                            <input type="radio" {...register("paymentMethod")} value={pm} className="sr-only" onChange={() => setPaymentMethod(pm)} />
                            <div className="text-2xl mb-1">{pm === "TRANSFER" ? "[Transfer]" : "[Tunai]"}</div>
                            <h3 className="font-bold text-sm text-[#0B1F44]">{pm === "TRANSFER" ? "Transfer Bank" : "Tunai"}</h3>
                            <p className="text-xs text-gray-400">{pm === "TRANSFER" ? "Bayar via transfer" : "Bayar saat ambil/antar"}</p>
                          </label>
                        ))}
                      </div>
                      {paymentMethod === "TRANSFER" && (
                        <div className="space-y-4">
                          {settings?.bankName && (
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                              <h3 className="font-medium text-blue-800 text-sm mb-2">Transfer ke Rekening:</h3>
                              <div className="space-y-1 text-sm">
                                <p className="text-blue-700"><span className="text-blue-500">Bank:</span> {settings.bankName}</p>
                                <p className="text-blue-700"><span className="text-blue-500">No. Rekening:</span> <span className="font-bold text-blue-900 select-all">{settings.bankAccountNumber}</span></p>
                                <p className="text-blue-700"><span className="text-blue-500">Atas Nama:</span> {settings.bankAccountName}</p>
                              </div>
                            </div>
                          )}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Bukti Transfer</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#F5B21A] transition-colors">
                              {paymentPreview ? (
                                <div className="space-y-3">
                                  <img src={paymentPreview} alt="Bukti Transfer" className="max-h-36 mx-auto rounded-xl" />
                                  <button type="button" onClick={() => { setPaymentFile(null); setPaymentPreview(""); }} className="text-red-500 text-xs hover:underline">Hapus</button>
                                </div>
                              ) : (
                                <label className="cursor-pointer">
                                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <p className="text-sm text-gray-500">Klik untuk upload bukti transfer</p>
                                  <p className="text-xs text-gray-400 mt-1">Maks 5MB (JPG, PNG, WebP)</p>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) { setPaymentFile(file); setValue("paymentFile", file); const reader = new FileReader(); reader.onload = (ev) => setPaymentPreview(ev.target?.result as string || ""); reader.readAsDataURL(file); }
                                  }} />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {paymentMethod === "TUNAI" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <p className="text-sm text-yellow-800">Pembayaran Tunai dilakukan saat pengambilan atau pengantaran kendaraan. Pesanan akan langsung masuk ke status Menunggu Konfirmasi Admin.</p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-6">
                      <button type="button" onClick={() => setStep(3)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">Kembali</button>
                      <button type="button" onClick={() => setStep(5)} className="px-6 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-xl transition-colors">Lanjutkan</button>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">Upload Foto KTP</h2>
                    <p className="text-sm text-gray-500 mb-4">Upload foto KTP untuk verifikasi identitas</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#F5B21A] transition-colors">
                      {ktpPreview ? (
                        <div className="space-y-3">
                          <img src={ktpPreview} alt="KTP Preview" className="max-h-48 mx-auto rounded-xl" />
                          <button type="button" onClick={() => { setKtpFile(null); setKtpPreview(""); }} className="text-red-500 text-xs hover:underline">Hapus</button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-500">Klik untuk upload KTP</p>
                          <p className="text-xs text-gray-400 mt-1">Maks 5MB (JPG, PNG, WebP)</p>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) { setKtpFile(file); const reader = new FileReader(); reader.onload = (ev) => setKtpPreview(ev.target?.result as string || ""); reader.readAsDataURL(file); }
                          }} />
                        </label>
                      )}
                    </div>
                    <div className="flex justify-between mt-6">
                      <button type="button" onClick={() => setStep(4)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">Kembali</button>
                      <button type="button" onClick={() => setStep(6)} className="px-6 py-3 bg-[#0B1F44] hover:bg-[#0B2B6E] text-white font-medium rounded-xl transition-colors">Lanjutkan</button>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-[#0B1F44] text-lg mb-4">Konfirmasi Pemesanan</h2>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-medium text-[#0B1F44] mb-3">Ringkasan Pesanan</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Kendaraan</span><span className="font-medium">{car.name} ({car.type === "MOTOR" ? "Motor" : "Mobil"})</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Tanggal</span><span className="font-medium">{formatDate(startDate)} - {formatDate(endDate)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Durasi</span><span className="font-medium">{duration} hari</span></div>
                          {car.type !== "MOTOR" && <div className="flex justify-between"><span className="text-gray-500">Layanan</span><span className="font-medium">{currentServiceType === "SELF_DRIVE" ? "Lepas Kunci" : "Dengan Supir"}</span></div>}
                          <div className="flex justify-between"><span className="text-gray-500">Pengambilan</span><span className="font-medium">{pickupMethod === "SELF_PICKUP" ? "Ambil Sendiri" : "Diantar"}</span></div>
                          {pickupMethod === "DELIVERY" && (
                            <>
                              <div className="flex justify-between"><span className="text-gray-500">Alamat</span><span className="font-medium text-right max-w-[200px]">{watch("pickupAddress")}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">No HP</span><span className="font-medium">{watch("deliveryPhone")}</span></div>
                            </>
                          )}
                          <div className="flex justify-between"><span className="text-gray-500">Pembayaran</span><span className="font-medium">{paymentMethod === "TRANSFER" ? "Transfer Bank" : "Tunai"}</span></div>
                          {watch("notes") && <div className="flex justify-between"><span className="text-gray-500">Catatan</span><span className="font-medium text-right max-w-[200px]">{watch("notes")}</span></div>}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-medium text-[#0B1F44] mb-3">Detail Biaya</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Harga sewa ({formatPrice(currentPrice)} x {duration} hari)</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Biaya antar</span><span className="font-medium">{deliveryFee > 0 ? formatPrice(deliveryFee) : "Gratis"}</span></div>
                          <div className="border-t border-gray-200 pt-2 flex justify-between"><span className="font-bold text-[#0B1F44]">Total</span><span className="font-bold text-[#F5B21A] text-lg">{formatPrice(totalPrice)}</span></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-medium text-[#0B1F44] mb-3">Dokumen</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            {ktpPreview ? (
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                            <span className={ktpPreview ? "text-green-700" : "text-red-500"}>{ktpPreview ? "Foto KTP sudah diupload" : "Foto KTP belum diupload"}</span>
                          </div>
                          {paymentMethod === "TRANSFER" && (
                            <div className="flex items-center space-x-2">
                              {paymentPreview ? (
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              )}
                              <span className={paymentPreview ? "text-green-700" : "text-red-500"}>{paymentPreview ? "Bukti transfer sudah diupload" : "Bukti transfer belum diupload"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <button type="button" onClick={() => setStep(5)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">Kembali</button>
                      <button type="submit" disabled={submitting} className="px-8 py-3 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] hover:from-[#d97706] hover:to-[#b45309] disabled:from-gray-300 disabled:to-gray-300 text-[#0B1F44] disabled:text-gray-500 font-bold rounded-xl transition-all duration-200 shadow-md">
                        {submitting ? (
                          <span className="flex items-center space-x-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Memproses...</span>
                          </span>
                        ) : "Konfirmasi & Kirim"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
                  <h3 className="font-semibold text-[#0B1F44] mb-4">Detail Harga</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Harga/hari</span><span className="font-medium">{formatPrice(currentPrice)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Durasi</span><span className="font-medium">{duration} hari</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Biaya antar</span><span className="font-medium">{deliveryFee > 0 ? formatPrice(deliveryFee) : "Gratis"}</span></div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between"><span className="font-bold text-[#0B1F44]">Total</span><span className="font-bold text-[#F5B21A]">{formatPrice(totalPrice)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent mx-auto" />
      </div>
    }>
      <BookingContent />
      <WhatsAppFloat />
    </Suspense>
  );
}
