import Login from "./pages/Login";
import NoFound from "./pages/404";
import { createBrowserRouter } from "react-router-dom";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "*",
    element: <NoFound />,
  },
]);

export default routes;
