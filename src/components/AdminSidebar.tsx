"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { href: "/admin/cars", label: "Kendaraan", icon: "M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" },
  { href: "/admin/bookings", label: "Pesanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/admin/payments", label: "Pembayaran", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  { href: "/admin/customers", label: "Pelanggan", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
  { href: "/admin/reports", label: "Laporan", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { href: "/admin/settings", label: "Pengaturan", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between shadow-sm">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showMobileMenu ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <span className="font-bold text-slate-900">Agil Rental</span>
        <Link href="/" className="text-xs text-slate-400 hover:text-[#F5B21A] transition-colors">&#x2190; Site</Link>
      </div>

      {showMobileMenu && <div className="lg:hidden fixed inset-0 z-20 bg-black/20 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />}

      <aside className={`fixed top-0 left-0 z-20 h-full w-64 bg-white border-r border-slate-200 shadow-sm transform transition-transform duration-200 lg:translate-x-0 ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-14 flex items-center px-5 border-b border-slate-100">
          <Link href="/admin/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-[#F5B21A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Agil Rental</p>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-0.5 overflow-y-auto" style={{ height: "calc(100% - 3.5rem - 4.5rem)" }}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setShowMobileMenu(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active ? "bg-slate-100 text-slate-900 border-l-2 border-[#F5B21A] -ml-0.5 pl-[10px]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}>
                <svg className={`w-5 h-5 flex-shrink-0 ${active ? "text-[#F5B21A]" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-amber-600">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || ""}</p>
              </div>
            </div>
            <button onClick={logout} className="p-1.5 hover:bg-red-50 rounded-lg group flex-shrink-0 transition-colors" title="Logout">
              <svg className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 pt-14 lg:pt-0">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-6 h-14">
            <h1 className="text-lg font-bold text-slate-900">{
              {"/admin/dashboard":"Dashboard","/admin/cars":"Kendaraan","/admin/bookings":"Pesanan","/admin/payments":"Pembayaran","/admin/customers":"Pelanggan","/admin/reports":"Laporan","/admin/settings":"Pengaturan"}[pathname] || {
                "/admin/cars/new":"Tambah Kendaraan"
              }[pathname] || "Admin"
            }</h1>
            <Link href="/" className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-[#F5B21A] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali ke Website</span>
            </Link>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
