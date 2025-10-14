import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginForAccount, getUserInfo } from '@/services/auth';

type Store = {
  token: any;
  profile: any;
  roles: string[];
  permissions: string[];
  fetchProfile: () => void;
  loginAccount: (params: any) => void;
  logoutAccount: () => void;
};

const useProfileStore = create<Store>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      roles: [],
      permissions: [],

      fetchProfile: async () => {
        const { code, msg, user, ...rest } = await getUserInfo();
        set((state) => ({ ...state, profile: user, ...rest }));

        return { code, msg, user, ...rest };
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
