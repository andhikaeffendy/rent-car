import { create } from "zustand";
import { api } from "@/lib/api/client";

interface CarStoreState {
  cars: any[];
  loading: boolean;
  error: string | null;
  filters: Record<string, string>;
  fetchCars: (extraFilters?: Record<string, string>) => Promise<void>;
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
}

export const useCarStore = create<CarStoreState>((set, get) => ({
  cars: [],
  loading: false,
  error: null,
  filters: {},
  fetchCars: async (extraFilters) => {
    set({ loading: true, error: null });
    try {
      const params = { ...get().filters, ...extraFilters };
      const data = await api<{ cars: any[] }>("/api/cars", { params });
      set({ cars: data.cars, loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal memuat data";
      set({ error: msg, loading: false });
    }
  },
  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
  },
  resetFilters: () => set({ filters: {} }),
}));
