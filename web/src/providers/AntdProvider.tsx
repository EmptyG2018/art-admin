import { App as AntdContext, ConfigProvider } from 'antd';
import Ant_zhCN from 'antd/es/locale/zh_CN';
const AntdProvider = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider locale={Ant_zhCN}>
    <AntdContext>{children}</AntdContext>
  </ConfigProvider>
);

export default AntdProvider;
