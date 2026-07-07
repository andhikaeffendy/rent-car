import { create } from "zustand";
import { api } from "@/lib/api/client";

interface BookingStoreState {
  bookings: any[];
  loading: boolean;
  error: string | null;
  fetchBookings: (params?: Record<string, string>) => Promise<void>;
  updateBookingStatus: (id: string, status: string) => Promise<void>;
}

export const useBookingStore = create<BookingStoreState>((set) => ({
  bookings: [],
  loading: false,
  error: null,
  fetchBookings: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await api<{ bookings: any[] }>("/api/bookings", { params });
      set({ bookings: data.bookings, loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal memuat data";
      set({ error: msg, loading: false });
    }
  },
  updateBookingStatus: async (id, status) => {
    try {
      await api("/api/bookings/" + id, { method: "PUT", data: { status } });
      set((state) => ({
        bookings: state.bookings.map((b: any) =>
          b.id === id ? { ...b, status } : b
        ),
      }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal update";
      set({ error: msg });
    }
  },
}));
