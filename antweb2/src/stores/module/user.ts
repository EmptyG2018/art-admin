import storage from 'store';
import { useSelector } from 'react-redux';
import type { StoreState } from '..';
import { loginForAccount, getUserInfo } from '@/services/user';

const useUserStore = () => {
  const user = useSelector((state: StoreState) => state.user);

  // 用户信息
  const getProfile = async () => {
    const { code, msg, ...userInfo } = await getUserInfo();
    storage.set('profile', userInfo);
  };

  // 登录账号
  const loginAccount = async (account: API.LoginAccountParams) => {
    const { token } = await loginForAccount(account);
    storage.set('token', token);
  };

  // 退出账号
  const logoutAccount = () => {
    storage.set('token', null);
  };

  return { user, getProfile, loginAccount, logoutAccount };
};

export default useUserStore;
