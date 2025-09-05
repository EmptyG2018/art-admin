import { Provider as ReduxProvider } from 'react-redux';
import type { ProviderProps } from 'react-redux';
import stores from '@/stores';

const StoreProvider = (props: Omit<ProviderProps, 'store'>) => {
  <ReduxProvider store={stores} {...props} />;
};

export default StoreProvider;
