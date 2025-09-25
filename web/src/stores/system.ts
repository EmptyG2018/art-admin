import { create } from 'zustand';
import { getSystemConfig, getSystemMenus } from '@/services/system';

type Store = {
  menus: any[];
  config: any;
  fetchMenus: () => void;
  fetchConfig: () => void;
};

const useSystemStore = create<Store>()((set) => ({
  menus: [],
  config: null,

  fetchConfig: async () => {
    const res = await getSystemConfig();
    set((state) => ({
      ...state,
      config: res.data,
    }));

    return res;
  },

  fetchMenus: async () => {
    const res = await getSystemMenus();
    set((state) => ({
      ...state,
      menus: res.data,
    }));

    return res;
  },
}));

export default useSystemStore;
