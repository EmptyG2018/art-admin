import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider, Dropdown, Avatar, theme } from 'antd';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Logo, SelectLang, ToggleFullscreenBtn } from '@/components/Layout';
import { useProfileStore, useSystemStore } from '@/stores';
import icons from '@/constants/icons';

const themeLayout: any = {
  light: theme.defaultAlgorithm,
  dark: theme.darkAlgorithm,
};

const generateDeepRoutes = (routes: any) => {
  if (!routes) return;
  if (!routes.length) return [];

  return routes
    .filter((route: any) => !route.hidden)
    .map((route: any) => {
      const Icon = icons[route.icon];
      return {
        path: route.path,
        name: route.title,
        icon: Icon ? <Icon /> : null,
        routes: generateDeepRoutes(route?.children),
      };
    });
};

const Admin: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { profile, logoutAccount } = useProfileStore();
  const { menus, theme } = useSystemStore();
  const location = useLocation();
  const navigate = useNavigate();

  const routes = useMemo(() => {
    return generateDeepRoutes(menus);
  }, [menus]);

  const { layout, ...token } = theme;

  if (typeof document === 'undefined') return <div />;

  return (
    <div
      id="art-admin"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ConfigProvider
        theme={{
          algorithm: themeLayout[layout],
          token,
        }}
        getTargetContainer={() => {
          return document.getElementById('art-admin') || document.body;
        }}
      >
        <ProLayout
          token={{
            header: {
              colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
            },
          }}
          location={{
            pathname: location.pathname,
          }}
          route={{
            path: '/',
            routes,
          }}
          logo={<Logo style={{ fontSize: 32 }} />}
          title="ART Admin"
          avatarProps={{
            src: <Avatar icon={<UserOutlined />} />,
            size: 'small',
            title: profile?.nickName,
            render: (props, dom) => {
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'settings',
                        icon: <SettingOutlined />,
                        label: '设置',
                        onClick: async () => {
                          navigate('/settings');
                        },
                      },
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
            return [<SelectLang />, <ToggleFullscreenBtn />];
          }}
          breadcrumbRender={() => []}
          menuItemRender={(item, dom) => (
            <div
              onClick={() => {
                if (!item.isUrl) navigate(item.path || '/');
              }}
            >
              {dom}
            </div>
          )}
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
                <div>
                  Powered by&nbsp;
                  <a
                    href="https://github.com/EmptyG2018/art-admin"
                    target="_blank"
                    style={{ color: 'inherit' }}
                  >
                    <GithubOutlined />
                  </a>
                </div>
              </div>
            );
          }}
          waterMarkProps={{
            content: `${profile?.nickName}`,
            fontSize: 20,
            gapX: 100,
            gapY: 100,
          }}
          fixSiderbar
          layout="mix"
          splitMenus={false}
          contentWidth="Fluid"
          siderMenuType="sub"
          fixedHeader
          siderWidth={256}
        >
          {element}
        </ProLayout>
      </ConfigProvider>
    </div>
  );
};

export default Admin;
