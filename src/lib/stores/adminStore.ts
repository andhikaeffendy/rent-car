import { create } from "zustand";
import { api } from "@/lib/api/client";

interface AdminStoreState {
  stats: any;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useAdminStore = create<AdminStoreState>((set) => ({
  stats: null,
  loading: false,
  error: null,
  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api("/api/admin/stats");
      set({ stats: data, loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal memuat data";
      set({ error: msg, loading: false });
    }
  },
}));
