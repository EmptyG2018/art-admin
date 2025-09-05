import { LogoutOutlined } from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
import { ConfigProvider, Dropdown } from 'antd';
import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SelectLang } from '@/components/Layout';
import { useSystemStore, useUserStore } from '@/stores/module';

const generateDeepRoutes = (routes: any) => {
  if (!routes) return;
  if (!routes.length) return [];

  return routes
    .filter((route: any) => !route.hidden)
    .map((route: any) => {
      return {
        path: route.path,
        name: route.meta.title,
        icon: route.meta.icon,
        routes: generateDeepRoutes(route?.children),
      };
    });
};

const Admin: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { system } = useSystemStore();
  const { user, logoutAccount } = useUserStore();
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
            waterMarkProps={{
              content: `${user.user.nickName}`,
              fontSize: 20,
              gapX: 100,
              gapY: 100,
            }}
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
            breadcrumbRender={() => []}
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
                          onClick: async () => {
                            await logoutAccount();
                            navigate('/login', { replace: true });
                          },
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
              return [<SelectLang />];
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
                  <div>© 2025 Made with love</div>
                  <div>by Ant Design</div>
                </div>
              );
            }}
            menuItemRender={(item, dom) => (
              <div
                onClick={() => {
                  navigate(item.path || '/');
                }}
              >
                {dom}
              </div>
            )}
            siderWidth={256}
            {...settings}
          >
            {element}
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
