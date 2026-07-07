"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gray-50 min-h-[80vh]">
        <div className="text-center px-4">
          <div className="w-28 h-28 bg-[#0B1F44] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <span className="text-5xl font-bold text-[#F5B21A]">?</span>
          </div>
          <h1 className="text-6xl font-bold text-[#0B1F44] mb-4">404</h1>
          <p className="text-xl text-gray-500 mb-2">Halaman Tidak Ditemukan</p>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] hover:from-[#d97706] hover:to-[#b45309] text-[#0B1F44] font-bold rounded-2xl shadow-lg shadow-[#F5B21A]/20 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
