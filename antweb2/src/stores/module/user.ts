import storage from "store";
import { useSelector } from "react-redux";
import { setUserInfo } from "../reducer/user";
import { LoginAccount } from "@services/user";
import store from "..";

const useUserStore = () => {
  const user = useSelector((state) => state.user);

  // 登录账号
  const loginAccount = async (account) => {
    const { token, userInfo } = await LoginAccount(account);

    storage.set("token", token);
    storage.set("userInfo", userInfo);

    store.dispatch(setUserInfo(userInfo));
  };

  // 退出账号
  const logoutAccount = () => {
    storage.set("token", null);
    storage.set("userInfo", null);

    storage.dispatch(setUserInfo(null));
  };

  return { user, isAdmin: user?.isAdmin === 1, loginAccount, logoutAccount };
};

export default useUserStore;
