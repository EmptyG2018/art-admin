import { Navigate, useLocation } from 'react-router-dom';
import { useProfileStore } from '@/stores';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// 免登录白名单
const WHITELIST = ['/login', '/404'];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { token } = useProfileStore();

  const isWhitelisted = WHITELIST.some(
    (path) => location.pathname === path || location.pathname === path + '/',
  );

  if (!!token && isWhitelisted) return <Navigate to="/" />;

  if (!token && !isWhitelisted)
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
      />
    );

  return children;
};

export default ProtectedRoute;
