import { useSelector, useDispatch } from 'react-redux';
import { setConfig, setMenus } from '@/stores/reducer/system';
import { getSystemConfig, getSystemMenus } from '@/services/system';
import type { StoreState } from '..';

const useSystemStore = () => {
  const system = useSelector((state: StoreState) => state.system);
  const dispatch = useDispatch();

  // 获取菜单
  const getMenus = async () => {
    const res = await getSystemMenus();
    dispatch(setMenus(res.data));

    return res;
  };

  // 获取菜单
  const getConfig = async () => {
    const res = await getSystemConfig();
    dispatch(setConfig(res.data));

    return res;
  };

  return { system, getMenus, getConfig };
};

export default useSystemStore;
