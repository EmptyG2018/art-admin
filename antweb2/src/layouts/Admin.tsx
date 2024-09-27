import { GithubFilled, LogoutOutlined } from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
import { ConfigProvider, Dropdown } from 'antd';
import { useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SelectLang } from '@/components/Layout';
import { useSystemStore, useUserStore } from '@/stores/module';

const generateDeepRoutes = (routes: any) => {
  if (!routes?.length) return null;

  return routes.map((route: any) => {
    return {
      path: route.path,
      name: route.meta.title,
      routes: generateDeepRoutes(route?.children),
    };
  });
};

const Admin = () => {
  const { system } = useSystemStore();
  const { user } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: false,
    navTheme: 'light',
    contentWidth: 'Fluid',
    colorPrimary: '#1677FF',
    siderMenuType: 'sub',
    fixedHeader: true,
  });

  if (typeof document === 'undefined') return <div />;

  const routes = useMemo(() => {
    return generateDeepRoutes(system.menus);
  }, [system.menus]);

  return (
    <div
      id="admin-template"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById('admin-template') || document.body;
          }}
        >
          <ProLayout
            prefixCls="my-prefix"
            bgLayoutImgList={[
              {
                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                left: 85,
                bottom: 100,
                height: '303px',
              },
              {
                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                bottom: -68,
                right: -45,
                height: '303px',
              },
              {
                src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
                bottom: 0,
                left: 0,
                width: '331px',
              },
            ]}
            location={{
              pathname: location.pathname,
            }}
            route={{
              path: '/',
              routes,
            }}
            token={{
              header: {
                colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
              },
            }}
            siderMenuType="group"
            siderWidth={256}
            menu={{
              collapsedShowGroupTitle: true,
            }}
            avatarProps={{
              src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
              size: 'small',
              title: user.user.nickName,
              render: (props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'logout',
                          icon: <LogoutOutlined />,
                          label: '退出登录',
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                );
              },
            }}
            actionsRender={(props) => {
              if (props.isMobile) return [];
              if (typeof window === 'undefined') return [];
              return [<SelectLang />, <GithubFilled key="GithubFilled" />];
            }}
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <a>
                  {logo}
                  {title}
                </a>
              );
              if (typeof window === 'undefined') return defaultDom;
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              if (_.isMobile) return defaultDom;
              return <>{defaultDom}</>;
            }}
            menuFooterRender={(props) => {
              if (props?.collapsed) return undefined;
              return (
                <div
                  style={{
                    textAlign: 'center',
                    paddingBlockStart: 12,
                  }}
                >
                  <div>© 2021 Made with love</div>
                  <div>by Ant Design</div>
                </div>
              );
            }}
            onMenuHeaderClick={(e) => console.log(e)}
            menuItemRender={(item, dom) => (
              <div
                onClick={() => {
                  navigate(item.path || '/');
                }}
              >
                {dom}
              </div>
            )}
            {...settings}
          >
            <Outlet />
            <SettingDrawer
              enableDarkTheme
              disableUrlParams
              getContainer={(e: any) => {
                if (typeof window === 'undefined') return e;
                return document.getElementById('admin-template');
              }}
              settings={settings}
              onSettingChange={setSetting}
            />
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};

export default Admin;
