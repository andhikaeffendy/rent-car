"use client";
import AdminSidebar from "@/components/AdminSidebar";
import { ToastProvider } from "@/components/Toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminSidebar>{children}</AdminSidebar>
    </ToastProvider>
  );
}
