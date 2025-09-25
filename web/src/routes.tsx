import { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { RrotectedRoute } from '@/components/Router';
import { Loading } from './components/Layout';
import { Admin } from '@/layouts';
import { useProfileStore, useSystemStore } from '@/stores';
import { Component as Login } from './pages/Login';
import NoFound from './pages/404';

const LayoutMap: Record<string, React.ReactNode> = {
  Layout: <Outlet />,
  ParentView: <Outlet />,
};

const modules = import.meta.glob('./pages/**/*.tsx');

const loadLazyPage = (page: string) => {
  for (const path in modules) {
    const dir = path.split('/pages')[1].split('.tsx')[0];
    if (dir === page) {
      const LazyComponent = lazy(() =>
        modules[path]()
          .then((r: any) => ({ default: r.Component }))
          .catch(() => ({ default: () => <div /> })),
      );
      return (
        <Suspense>
          <LazyComponent />
        </Suspense>
      );
    }
  }
};

const layoutElement = (element: string) => LayoutMap[element] || <div />;

const generateDeepRoutes = (routes: any) => {
  if (!routes) return;
  if (!routes.length) return [];

  const filterRoutes = routes.map((route: any) => {
    const isSubMenu = !!route?.children;
    let element = isSubMenu
      ? layoutElement(route.component)
      : loadLazyPage(route.component);

    return (
      <Route path={route.path} element={element} key={route.path}>
        {generateDeepRoutes(route?.children)}
      </Route>
    );
  });

  const visibleRouteIdx = routes.findIndex((route: any) => !route.hidden);
  const indexRoutes =
    visibleRouteIdx !== -1
      ? [
          <Route
            index
            element={<Navigate to={routes[visibleRouteIdx].path} replace />}
            key="index"
          />,
        ]
      : [];

  return [...indexRoutes, ...filterRoutes];
};

const Permission = () => {
  const { fetchProfile } = useProfileStore();
  const { menus, fetchConfig, fetchMenus } = useSystemStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    Promise.all([fetchProfile(), fetchConfig(), fetchMenus()]).then(() => {
      setInitialized(true);
    });
  }, [fetchProfile, fetchConfig, fetchMenus]);

  const dynamicRoutes = useMemo(() => {
    return generateDeepRoutes(menus);
  }, [menus]);

  if (!initialized)
    return (
      <div style={{ height: '100vh' }}>
        <Loading />
      </div>
    );

  return (
    <>
      <Admin element={<Routes>{dynamicRoutes}</Routes>} />
    </>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<RrotectedRoute element={<Login />} />} />
        <Route path="/404" element={<NoFound />} />
        <Route
          path="/*"
          element={<RrotectedRoute element={<Permission />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
