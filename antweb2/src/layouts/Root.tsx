import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Loading } from '@/components/Layout';
import { RrotectedRoute } from '@/components/Router';
import useUserStore from '@/stores/module/user';
import useSystemStore from '@/stores/module/system';

const Root = () => {
  const { getProfile } = useUserStore();
  const { getConfig, getMenus } = useSystemStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    Promise.all([getProfile(), getConfig(), getMenus()]).then(() => {
      setInitialized(true);
    });
  }, []);

  if (!initialized)
    return (
      <div style={{ height: '100vh' }}>
        <Loading />
      </div>
    );

  return <RrotectedRoute element={<Outlet />} />;
};

export default Root;
