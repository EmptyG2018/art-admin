import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '@/stores/module/user';

// 免登录白名单
export const WHITELIST = ['/login'];

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({
  element,
}) => {
  const location = useLocation();
  const { user } = useUserStore();

  if (!!user && WHITELIST.includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  if (!user && !WHITELIST.includes(location.pathname)) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
      />
    );
  }

  return element;
};

export default ProtectedRoute;
