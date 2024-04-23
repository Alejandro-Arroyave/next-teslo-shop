import { create } from "zustand";

interface State {
  isSideMenuOpen: boolean;

  openSideMenu: () => void;
  closeSideMenu: () => void;
}

export const useUiStore = create<State>()((set) => ({
  isSideMenuOpen: false,

  openSideMenu: () => set((state) => ({ isSideMenuOpen: true })),
  closeSideMenu: () => set((state) => ({ isSideMenuOpen: false })),
}));
