import { createBrowserRouter } from 'react-router-dom';
import { Root, Admin } from '@/layouts';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import NoFound from './pages/404';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Admin />,
        children: [
          {
            path: '/weclome',
            element: <Welcome />,
          },
        ],
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  {
    path: '*',
    element: <NoFound />,
  },
]);

export default routes;
