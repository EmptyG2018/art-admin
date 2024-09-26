import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RrotectedRoute } from '@/components/Router';
import { Loading } from './components/Layout';
import { Root, Admin } from '@/layouts';
import useSystemStore from '@/stores/module/system';
import { Component as Login } from './pages/Login';
import NoFound from './pages/404';

const LayoutMap: Record<string, React.ReactNode> = {
  Admin: <Admin />,
};

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
const modules = import.meta.glob('./pages/**/*.tsx');

const loadPage = (page: string) => {
  for (const path in modules) {
    const dir = path.split('/pages')[1].split('.tsx')[0];
    if (dir === page) return () => modules[path]();
  }
};

const layoutElement = (element: string) => LayoutMap[element] || <div />;

const generateDeepRoutes = (routes: any) => {
  if (!routes?.length) return null;

  return routes.map((route: any) => {
    const isSubMenu = !!route?.children;
    let element, lazy;
    if (isSubMenu) {
      element = layoutElement(route.component);
    } else {
      lazy = loadPage(route.component);
    }
    return {
      path: route.path,
      element,
      lazy,
      children: generateDeepRoutes(route?.children),
    };
  });
};

const AppRoutes = () => {
  const { system } = useSystemStore();

  const dynamicRoutes = useMemo(() => {
    return generateDeepRoutes(CONST_ROUTES);
  }, []);

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <RrotectedRoute element={<Login />} />,
    },
    {
      path: '/',
      element: <Root />,
      children: [
        {
          index: true,
          element: <div>this is index</div>,
        },
        ...dynamicRoutes,
      ],
    },
    {
      path: '*',
      element: <NoFound />,
    },
  ]);

  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <div style={{ height: '100vh' }}>
          <Loading />
        </div>
      }
    />
  );
};

export default AppRoutes;
