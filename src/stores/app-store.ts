import { create } from 'zustand';

import { Screen } from '../types/components.js';

type Store = {
  screen: Screen;
  setScreen: (screen: Screen) => void;
};

export const useAppStore = create<Store>()((set) => ({
  screen: 'menu',
  setScreen: (screen) => set(() => ({ screen })),
}));
