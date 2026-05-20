import { createBrowserRouter } from "react-router";
import Register from "./features/auth/Pages/Register";
import Login from "./features/auth/Pages/login";
import Dashboard from "./features/dashboard/Pages/Dashboard";
import GoogleSuccess from "./features/auth/Pages/GoogleSuccess";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/auth/google/success",
    element: <GoogleSuccess />
  },
  {
    path: "/auth/google/error",
    element: <Login /> 
  }
])