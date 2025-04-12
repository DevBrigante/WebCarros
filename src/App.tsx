import { createBrowserRouter } from "react-router-dom";
import { CarDetails } from "./pages/car";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/resgister";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/newCar";
import { Layout } from "./components/layout";
import { Private } from "./routes/private";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/car/:id",
        element: <CarDetails />
      },
      {
        path: "/dashboard",
        element: <Private><Dashboard /></Private>
      },
      {
        path: "/dashboard/new",
        element: <Private><New /></Private>
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
])


