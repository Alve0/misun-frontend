import { createBrowserRouter } from "react-router";
import Root from "../Layouts/Root";
import Home from "../Pages/Home/Home";
import Error from "../Components/404";

const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: Error,
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
]);

export default router;
