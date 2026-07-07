"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone || undefined,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(result.error || "Gagal mendaftar");
      }
    } catch {
      setError("Terjadi kesalahan server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-sm sm:max-w-md">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0B1F44] rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#F5B21A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F44]">Daftar</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Buat akun Agil Rental
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="Nama anda"
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#F5B21A]"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="email@anda.com"
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#F5B21A]"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="0812-3456-7890"
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#F5B21A]"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#F5B21A]"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="Ketik ulang password"
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#F5B21A]"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] hover:from-[#d97706] hover:to-[#b45309] disabled:from-gray-300 disabled:to-gray-300 text-[#0B1F44] disabled:text-gray-500 font-bold rounded-xl transition-all duration-200 shadow-sm text-xs sm:text-sm"
                >
                  {submitting ? "Memproses..." : "Daftar"}
                </button>
              </form>

              <div className="text-center mt-5 sm:mt-6">
                <p className="text-xs sm:text-sm text-gray-500">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="text-[#F5B21A] hover:text-[#d97706] font-medium">
                    Masuk
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
