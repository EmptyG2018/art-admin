import { Admin } from '@/layouts';
import Login from './pages/Login';
import NoFound from './pages/404';
import Welcome from './pages/Welcome';
import { createBrowserRouter } from 'react-router-dom';

const routes = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
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
    path: '*',
    element: <NoFound />,
  },
]);

export default routes;
