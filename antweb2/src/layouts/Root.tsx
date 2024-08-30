import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useUserStore from '@/stores/module/user';

// 落地页
const ENTRYPAGE = '/';

// 免登录白名单
export const WHITELIST = ['/login'];

const Root = () => {
  const location = useLocation();
  const { user } = useUserStore();
  const [initialized, setInitialized] = useState(false);

  // useEffect(() => {
  //   if (!!user && WHITELIST.includes(location.pathname)) {
  //     window.location.href = ENTRYPAGE;
  //     return;
  //   }

  //   if (!user && !WHITELIST.includes(location.pathname)) {
  //     window.location.href = ENTRYPAGE;
  //     return;
  //   }

  //   setInitialized(true);
  // }, []);

  if (true) return <Outlet />;
  return <span>sss</span>;
};

export default Root;
