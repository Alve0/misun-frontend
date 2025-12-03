import { createBrowserRouter } from "react-router";
import Root from "../Layouts/Root";
import Home from "../Pages/Home/Home";
import Error from "../Components/404";
import Account from "../Layouts/Account";
import Register from "../Components/Auth/Register";
import Login from "../Components/Auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },

  {
    path: "/login",
    element: <Account />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },

  {
    path: "/register",
    element: <Account />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Register />,
      },
    ],
  },
]);

export default router;
