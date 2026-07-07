"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/cars", label: "Kendaraan" },
    { href: "/#layanan", label: "Layanan", mobileLabel: "Layanan" },
    { href: "/#kontak", label: "Kontak", mobileLabel: "Kontak" },
  ];

  const isActive = (href: string) => {
    if (href.includes("#")) {
      const [base, hash] = href.split("#");
      return pathname === base && window.location.hash === "#" + hash;
    }
    // Beranda hanya aktif jika pathname "/" tanpa hash (hash berarti section lain)
    if (href === "/") return pathname === "/" && !window.location.hash;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group relative">
            <div className="relative">
              <div className={`w-10 h-10 bg-[#0B1F44] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 ${scrolled ? "scale-95" : "scale-100"}`}>
                <svg className="w-5 h-5 text-[#F5B21A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 17h14M5 17l-2-4h2l2 4M5 17l-2 3h18l-2-3M19 17l2-4h-2l-2 4M7 13h10M7 13l-1-5h12l-1 5M7 13v4M17 13v4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#F5B21A] rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold bg-gradient-to-r from-[#0B1F44] to-[#0F5EF7] bg-clip-text text-transparent leading-tight transition-all duration-300 ${scrolled ? "text-base" : "text-lg"}`}>
                Agil Rental
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase leading-tight -mt-0.5">
                Ambon
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-1 shadow-inner border border-gray-100/50">
              {[
                { href: "/", label: "Beranda" },
                { href: "/cars", label: "Kendaraan" },
                { href: "/#layanan", label: "Layanan" },
              ].map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 inline-block ${
                    isActive(link.href)
                      ? "text-[#0B1F44] bg-white shadow-sm"
                      : "text-gray-500 hover:text-[#0B1F44] hover:bg-white/50"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] rounded-full" />
                  )}
                </Link>
              ))}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285754650271"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 inline-block text-gray-500 hover:text-emerald-600 hover:bg-white/50"
              >
                Kontak
              </a>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="w-28 h-9 bg-gray-100 rounded-xl shimmer" />
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0B1F44]/5 to-[#0B1F44]/10 text-[#0B1F44] hover:from-[#0B1F44]/10 hover:to-[#0B1F44]/20 border border-[#0B1F44]/10 transition-all duration-200 hover:shadow-md ${
                    showUserMenu ? "shadow-md border-[#0B1F44]/20" : "shadow-sm"
                  }`}
                >
                  <div className="w-7 h-7 bg-[#0B1F44] rounded-full flex items-center justify-center shadow-sm ring-2 ring-[#F5B21A]/30">
                    <span className="text-[#F5B21A] text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 py-2 z-50">
                    <div className="px-5 py-3 border-b border-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#0B1F44] rounded-full flex items-center justify-center shadow-sm ring-2 ring-[#F5B21A]/30">
                          <span className="text-[#F5B21A] text-base font-bold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0B1F44] truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
                          user.role === "ADMIN" ? "bg-[#F5B21A]/20 text-[#b45309]" : "bg-[#0B1F44]/10 text-[#0B1F44]"
                        }`}>
                          {user.role === "ADMIN" ? "Admin" : "Customer"}
                        </span>
                      </div>
                    </div>
                    {user.role === "ADMIN" ? (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#0B1F44]/10 flex items-center justify-center mr-3 group-hover:bg-[#0B1F44]/20 transition-colors">
                          <svg className="w-4 h-4 text-[#0B1F44]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </div>
                        <div>
                          <p className="font-medium">Dashboard Admin</p>
                          <p className="text-xs text-gray-400">Kelola data & pesanan</p>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#0B1F44]/10 flex items-center justify-center mr-3 group-hover:bg-[#0B1F44]/20 transition-colors">
                          <svg className="w-4 h-4 text-[#0B1F44]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <div>
                          <p className="font-medium">Dashboard Saya</p>
                          <p className="text-xs text-gray-400">Lihat riwayat booking</p>
                        </div>
                      </Link>
                    )}
                    <hr className="mx-3 border-gray-100" />
                    <button
                      onClick={() => { setShowUserMenu(false); logout(); }}
                      className="flex items-center w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      </div>
                      <div>
                        <p className="font-medium">Logout</p>
                        <p className="text-xs text-red-400">Keluar dari akun</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#0B1F44] transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="relative inline-flex items-center px-5 py-2.5 text-sm font-bold text-white overflow-hidden rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#F5B21A]/25 group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#F5B21A] via-[#fbbf24] to-[#F5B21A] bg-[length:200%_100%] animate-shimmer group-hover:animate-none" />
                  <span className="absolute inset-0 bg-gradient-to-r from-[#d97706] to-[#b45309] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="relative flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Daftar</span>
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-all duration-200 ${
              isOpen
                ? "bg-[#0B1F44] text-white shadow-lg"
                : "text-gray-500 hover:bg-gray-100 hover:text-[#0B1F44]"
            }`}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-100 shadow-lg shadow-black/5">
          {user && (
            <div className="px-4 pt-4 pb-3 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 bg-[#0B1F44] rounded-full flex items-center justify-center shadow-sm ring-2 ring-[#F5B21A]/30">
                  <span className="text-[#F5B21A] text-base font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-[#0B1F44] truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
                  user.role === "ADMIN" ? "bg-[#F5B21A]/20 text-[#b45309]" : "bg-[#0B1F44]/10 text-[#0B1F44]"
                }`}>
                  {user.role === "ADMIN" ? "Admin" : "Customer"}
                </span>
              </div>
            </div>
          )}
          <div className="px-4 py-3 space-y-1">
            {[
              { href: "/", label: "Beranda", icon: "🏠" },
              { href: "/cars", label: "Kendaraan", icon: "🚗" },
              { href: "/#layanan", label: "Layanan", icon: "🔧" },
            ].map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-600 hover:text-[#0B1F44] hover:bg-gray-50 border border-transparent"
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285754650271"}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent"
            >
              <span className="mr-3">📞</span>
              Hubungi Kami
            </a>
          </div>
          <div className="px-4 py-4 space-y-3 border-t border-gray-100">
            {user ? (
              <>
                <Link
                  href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-sm font-bold text-[#0B1F44] bg-gradient-to-r from-[#0B1F44]/5 to-[#0B1F44]/10 border border-[#0B1F44]/20 rounded-xl hover:from-[#0B1F44]/10 hover:to-[#0B1F44]/20 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => { setIsOpen(false); logout(); }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md shadow-red-500/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 text-sm font-bold text-[#0B1F44] bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#F5B21A] to-[#f59e0b] rounded-xl hover:from-[#d97706] hover:to-[#b45309] transition-all duration-200 shadow-md shadow-[#F5B21A]/20"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
