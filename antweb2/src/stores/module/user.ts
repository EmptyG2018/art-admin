import storage from 'store';
import cookie from 'js-cookie';
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
    const res = await loginForAccount(account);
    cookie.set('token', res.token);

    return res;
  };

  // 退出账号
  const logoutAccount = () => {
    cookie.remove('token');
  };

  return { user, getProfile, loginAccount, logoutAccount };
};

export default useUserStore;
