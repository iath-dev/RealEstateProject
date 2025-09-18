import { create } from 'zustand';

export type PropertyFiltersModel = {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  [key: string]: string | number | undefined;
};

type PropertyStore = {
  filters: PropertyFiltersModel;
  selectedPropertyId: number | null;
  dialogOpen: boolean;

  // actions
  setFilters: (f: PropertyFiltersModel) => void;
  resetFilters: () => void;
  selectProperty: (id: number | null) => void;
  openDialog: () => void;
  closeDialog: () => void;
};

export const usePropertyStore = create<PropertyStore>((set) => ({
  filters: {},
  selectedPropertyId: null,
  dialogOpen: false,

  setFilters: (f: PropertyFiltersModel) => set(() => ({ filters: { ...f } })),
  resetFilters: () => set(() => ({ filters: {} })),

  selectProperty: (id: number | null) => set(() => ({ selectedPropertyId: id })),
  openDialog: () => set(() => ({ dialogOpen: true })),
  closeDialog: () => set(() => ({ dialogOpen: false, selectedPropertyId: null })),
}));

export default usePropertyStore;
