import { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { ProtectedRoute } from '@/components/Router';
import { Result, Button, Typography, Skeleton } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Loading, NoFound } from './components/Layout';
import { Admin } from '@/layouts';
import { T } from '@/locales';
import { useProfileStore, useSystemStore } from '@/stores';
import { Component as Login } from './pages/Login';
import Settings from './pages/Settings';

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
        <Suspense fallback={<Skeleton style={{ padding: 40 }} />}>
          <LazyComponent />
        </Suspense>
      );
    }
  }

  return (
    <Result
      status="error"
      title={<T id="layout.route.404" />}
      subTitle={<T id="layout.route.404.subTitle" />}
    >
      <div className="desc">
        <Typography.Paragraph>
          <Typography.Text
            strong
            style={{
              fontSize: 16,
            }}
          >
            <T id="layout.route.404.help" />
          </Typography.Text>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <QuestionCircleOutlined className="site-result-demo-error-icon" />{' '}
          <T
            id="layout.route.404.message1"
            values={{
              path: <Typography.Text code>src/pages{page}.tsx</Typography.Text>,
            }}
          />
        </Typography.Paragraph>
        <Typography.Paragraph>
          <QuestionCircleOutlined className="site-result-demo-error-icon" />{' '}
          <T id="layout.route.404.message2" />
        </Typography.Paragraph>
      </div>
    </Result>
  );
};

const layoutElement = (element: string) => LayoutMap[element] || <div />;

const generateDeepRoutes = (routes: any) => {
  if (!routes) return;
  if (!routes.length) return [];

  const filterRoutes = routes.map((route: any) => {
    const isSubMenu = !!route?.children;
    const element = isSubMenu
      ? layoutElement(route.component)
      : loadLazyPage(route.component);

    return (
      <Route path={route.path} element={element} key={route.path}>
        {generateDeepRoutes(route?.children)}
      </Route>
    );
  });

  const visibleRoute = routes.find((route: any) => !route.hidden);
  const indexRoutes = visibleRoute
    ? [
        <Route
          index
          element={<Navigate to={visibleRoute.path} replace />}
          key="index"
        />,
      ]
    : [];

  return [...indexRoutes, ...filterRoutes];
};

const Permission = () => {
  const { fetchProfile } = useProfileStore();
  const { menus, fetchConfig, fetchMenus } = useSystemStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProfile(), fetchConfig(), fetchMenus()])
      .then(() => {
        setError('');
      })
      .catch((error) => {
        setError(error.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchProfile, fetchConfig, fetchMenus]);

  const dynamicRoutes = useMemo(() => {
    return generateDeepRoutes(menus);
  }, [menus]);

  if (loading)
    return (
      <div style={{ height: '100vh' }}>
        <Loading />
      </div>
    );

  if (error)
    return (
      <Result
        status="error"
        title={<T id="layout.config.error" />}
        subTitle={error}
        extra={[
          <Button
            type="primary"
            key="refresh"
            onClick={() => location.reload()}
          >
            <T id="layout.config.refresh" />
          </Button>,
        ]}
      ></Result>
    );

  return (
    <Admin
      element={
        <Routes>
          {dynamicRoutes}
          <Route path="/settings" element={<Settings />} />
          <Route path="/*" element={<NoFound />} />
        </Routes>
      }
    />
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ProtectedRoute>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<NoFound showHomeBtn />} />
          <Route path="/*" element={<Permission />} />
        </Routes>
      </ProtectedRoute>
    </BrowserRouter>
  );
};

export default AppRoutes;
