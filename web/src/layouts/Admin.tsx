import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider, Dropdown } from 'antd';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { SelectLang } from '@/components/Layout';
import { useProfileStore, useSystemStore } from '@/stores';
import icons from '@/constants/icons';

const generateDeepRoutes = (routes: any) => {
  if (!routes) return;
  if (!routes.length) return [];

  return routes
    .filter((route: any) => !route.hidden)
    .map((route: any) => {
      const Icon = icons[route.meta.icon];
      return {
        path: route.path,
        name: route.meta.title,
        icon: Icon ? <Icon /> : null,
        routes: generateDeepRoutes(route?.children),
      };
    });
};

const Admin: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { profile, logoutAccount } = useProfileStore();
  const { menus } = useSystemStore();
  const location = useLocation();
  const navigate = useNavigate();

  const routes = useMemo(() => {
    return generateDeepRoutes(menus);
  }, [menus]);

  if (typeof document === 'undefined') return <div />;

  return (
    <div
      id="admin-template"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ConfigProvider
        getTargetContainer={() => {
          return document.getElementById('admin-template') || document.body;
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
          avatarProps={{
            src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
            size: 'small',
            title: profile.user.nickName,
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
            return [<SelectLang />];
          }}
          breadcrumbRender={() => []}
          menuItemRender={(item, dom) => (
            <div
              onClick={() => {
                navigate(item.path || '/');
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
                <div>by Ant Design</div>
              </div>
            );
          }}
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
            content: `${profile.user.nickName}`,
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
