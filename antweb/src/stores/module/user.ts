import cookie from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import type { StoreState } from '..';
import { setProfile } from '@/stores/reducer/user';
import { loginForAccount, getUserInfo } from '@/services/auth';

const useUserStore = () => {
  const user = useSelector((state: StoreState) => state.user);
  const dispatch = useDispatch();

  // 用户信息
  const getProfile = async () => {
    const { code, msg, ...userInfo } = await getUserInfo();
    dispatch(setProfile(userInfo));
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
