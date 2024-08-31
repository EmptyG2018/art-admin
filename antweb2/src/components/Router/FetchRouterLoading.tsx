import { useEffect } from 'react';
import { Loading } from '../Layout';
import useSystemStore from '@/stores/module/system';

const FetchRouterLoading = () => {
  const { getMenus } = useSystemStore();

  useEffect(() => {
    getMenus();
  }, [getMenus]);

  return (
    <div style={{ height: '100vh' }}>
      <Loading />
    </div>
  );
};

export default FetchRouterLoading;
