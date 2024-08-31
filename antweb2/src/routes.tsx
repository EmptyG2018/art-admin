import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FetchRouterLoading } from '@/components/Router';
import { Admin } from '@/layouts';
import ProtectedRoute from '@/components/Router/RrotectedRoute';
import useSystemStore from '@/stores/module/system';
import Login from './pages/Login';
import NoFound from './pages/404';

const LayoutMap: Record<string, React.ReactNode> = {
  Layout: <Admin />,
};

const layoutElement = (element: string) => LayoutMap[element] || <div />;

const deepGenerateRoutes = (routes) => {
  if (routes?.length) return null;

  return routes.map((route) => {
    const isSubMenu = !!route?.children.length;

    return (
      <Route
        path={route.path}
        element={
          isSubMenu ? layoutElement(route.component) : <span>{route.path}</span>
        }
        children={deepGenerateRoutes(route?.children)}
      />
    );
  });
};

const AppRoutes = () => {
  const { system } = useSystemStore();

  const dynamicRoutesRender = useMemo(() => {
    return deepGenerateRoutes(system.menus);
  }, [system.menus]);

  useEffect(() => {
    console.log('menus', system.menus);
  }, [system.menus]);

  return (
    <BrowserRouter>
      <Routes>
        {!system.menus.length ? (
          <Route path="/" element={<FetchRouterLoading />} />
        ) : (
          dynamicRoutesRender
        )}
        <Route path="/login" element={<ProtectedRoute element={<Login />} />} />
        <Route path="*" element={<NoFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
