import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginForAccount, getUserInfo } from '@/services/auth';

type Store = {
  token: any;
  profile: any;
  fetchProfile: () => void;
  loginAccount: (params: any) => void;
  logoutAccount: () => void;
};

const useProfileStore = create<Store>()(
  persist(
    (set) => ({
      token: null,
      profile: null,

      fetchProfile: async () => {
        const { code, msg, ...profile } = await getUserInfo();
        set((state) => ({ ...state, profile }));

        return { code, msg, ...profile };
      },

      // 登录账号
      loginAccount: async (account: API.LoginAccountParams) => {
        const res = await loginForAccount(account);
        set((state) => ({ ...state, token: res.token }));

        return res;
      },

      // 退出账号
      logoutAccount: () => {
        set((state) => ({ ...state, token: null }));
      },
    }),
    {
      name: 'token',
      partialize: (state) => ({
        token: state.token,
      }),
    },
  ),
);

export default useProfileStore;
