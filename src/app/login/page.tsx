"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const redirect = searchParams.get("redirect") || "";
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        const targetUrl = redirect ? decodeURIComponent(redirect) : (result.user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
        window.location.href = targetUrl;
      } else {
        setError(result.error || "Email atau password salah");
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
                    <path d="M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F44]">Masuk</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Masuk ke akun Agil Rental Mobil Anda
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
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="admin@agilrental.test"
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A] transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="password123"
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#F5B21A] focus:border-[#F5B21A] transition-colors"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] hover:from-[#d97706] hover:to-[#b45309] disabled:from-gray-300 disabled:to-gray-300 text-[#0B1F44] disabled:text-gray-500 font-bold rounded-xl transition-all duration-200 shadow-sm text-xs sm:text-sm"
                >
                  {submitting ? "Memproses..." : "Masuk"}
                </button>
              </form>

              <div className="text-center mt-5 sm:mt-6">
                <p className="text-xs sm:text-sm text-gray-500">
                  Belum punya akun?{" "}
                  <Link href="/register" className="text-[#F5B21A] hover:text-[#d97706] font-medium">
                    Daftar
                  </Link>
                </p>
              </div>

              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100">
                <p className="text-[10px] sm:text-xs text-gray-400 text-center mb-2 sm:mb-3">
                  Akun Demo
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-2.5 sm:p-3">
                    <p className="font-semibold text-[#0B1F44] text-[11px] sm:text-xs">👑 Admin</p>
                    <p className="text-gray-400 text-[10px] sm:text-xs truncate">admin@agilrental.test</p>
                    <p className="text-gray-400 text-[10px] sm:text-xs">password123</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 sm:p-3">
                    <p className="font-semibold text-[#0B1F44] text-[11px] sm:text-xs">👤 Customer</p>
                    <p className="text-gray-400 text-[10px] sm:text-xs truncate">budi@example.com</p>
                    <p className="text-gray-400 text-[10px] sm:text-xs">password123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
