"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

interface AdminSidebarProps {
  children: React.ReactNode;
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      href: "/admin/cars",
      label: "Mobil",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" />
        </svg>
      ),
    },
    {
      href: "/admin/bookings",
      label: "Pesanan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      href: "/admin/payments",
      label: "Bayar",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      href: "/admin/customers",
      label: "Pelanggan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      href: "/admin/reports",
      label: "Laporan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: "/admin/settings",
      label: "Pengaturan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="w-64 bg-[#0B1F44] text-white hidden md:flex flex-col shrink-0">
        <div className="p-5 border-b border-white/5">
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#F5B21A] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0B1F44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">Agil Rental</p>
              <p className="text-[10px] text-[#F5B21A]/80 font-medium uppercase tracking-wider">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-[#F5B21A]/20 text-[#F5B21A] shadow-sm"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={isActive(item.href) ? "text-[#F5B21A]" : "text-gray-500"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive(item.href) && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#F5B21A] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1 border-t border-white/5 pt-4">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Lihat Website</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — mobile: show user + logout + menu toggle */}
        <div className="bg-white border-b border-gray-100 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <span className="text-sm font-bold text-[#0B1F44]">Admin</span>
          </div>

          {user && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-500">Admin</p>
                <p className="text-sm font-medium text-[#0B1F44]">{user.name}</p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0B1F44] rounded-full flex items-center justify-center ring-2 ring-[#F5B21A]/30">
                <span className="text-[#F5B21A] text-xs sm:text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Logout button in top bar for mobile */}
              <button
                onClick={logout}
                className="md:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile slide-down menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-b border-gray-100 shadow-lg shadow-black/5">
            <div className="px-3 py-3 space-y-1 max-h-[60vh] overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-[#F5B21A]/10 text-[#0B1F44] font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className={isActive(item.href) ? "text-[#F5B21A]" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive(item.href) && (
                    <span className="ml-auto w-1.5 h-1.5 bg-[#F5B21A] rounded-full" />
                  )}
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              <Link
                href="/"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Lihat Website</span>
              </Link>
              <button
                onClick={() => { setShowMobileMenu(false); logout(); }}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center text-[9px] font-medium transition-colors ${
              isActive(item.href) ? "text-[#F5B21A]" : "text-gray-400"
            }`}
          >
            <span className="mb-0.5 scale-75 origin-bottom">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        {/* Extra nav items in bottom: Laporan & Pengaturan via "more" */}
        <Link
          href="/admin/reports"
          className={`flex-1 py-1.5 flex flex-col items-center justify-center text-[9px] font-medium transition-colors ${
            isActive("/admin/reports") ? "text-[#F5B21A]" : "text-gray-400"
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Laporan</span>
        </Link>
      </div>
    </div>
  );
}
