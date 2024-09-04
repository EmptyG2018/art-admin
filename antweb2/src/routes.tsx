import { lazy, useMemo } from 'react';
import { Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FetchRouterLoading, RrotectedRoute } from '@/components/Router';
import { Root, Admin } from '@/layouts';
import useSystemStore from '@/stores/module/system';
import Login from './pages/Login';
import NoFound from './pages/404';

const CONST_ROUTES = [
  {
    alwaysShow: true,
    component: 'Admin',
    redirect: 'noRedirect',
    hidden: false,
    name: 'System',
    query: null,
    path: '/system',
    meta: {
      icon: 'system',
      link: null,
      noCache: false,
      title: '系统管理',
    },
    children: [
      {
        component: '/System/User/index',
        hidden: false,
        name: 'User',
        query: null,
        path: '/system/user',
        meta: {
          icon: 'user',
          link: null,
          noCache: false,
          title: '用户管理',
        },
      },
      {
        component: '/System/Role/index',
        hidden: false,
        name: 'Role',
        query: null,
        path: '/system/role',
        meta: {
          icon: 'peoples',
          link: null,
          noCache: false,
          title: '角色管理',
        },
      },
      {
        component: '/System/Menu/index',
        hidden: false,
        name: 'Menu',
        query: null,
        path: '/system/menu',
        meta: {
          icon: 'tree-table',
          link: null,
          noCache: false,
          title: '菜单管理',
        },
      },
      {
        component: '/System/Dept/index',
        hidden: false,
        name: 'Dept',
        query: null,
        path: '/system/dept',
        meta: {
          icon: 'tree',
          link: null,
          noCache: false,
          title: '部门管理',
        },
      },
      {
        component: '/System/Post/index',
        hidden: false,
        name: 'Post',
        query: null,
        path: '/system/post',
        meta: {
          icon: 'post',
          link: null,
          noCache: false,
          title: '岗位管理',
        },
      },
      {
        component: '/System/Dict/index',
        hidden: false,
        name: 'Dict',
        query: null,
        path: '/system/dict',
        meta: {
          icon: 'dict',
          link: null,
          noCache: false,
          title: '字典管理',
        },
      },
    ],
  },
];

const LayoutMap: Record<string, React.ReactNode> = {
  Admin: <Admin />,
};
const layoutElement = (element: string) => LayoutMap[element] || <div />;

const deepGenerateRoutes = (routes) => {
  if (!routes?.length) return null;

  return routes.map((route) => {
    const isSubMenu = !!route?.children;

    return (
      <Route
        path={route.path}
        element={
          isSubMenu
            ? layoutElement(route.component)
            : lazy(() => import(`./pages/System/User/index`))
        }
        children={deepGenerateRoutes(route?.children)}
      />
    );
  });
};

const AppRoutes = () => {
  const { system } = useSystemStore();

  const dynamicRoutesRender = useMemo(() => {
    return deepGenerateRoutes(CONST_ROUTES);
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '*',
      element: <NoFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
