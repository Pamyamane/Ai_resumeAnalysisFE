
import { createBrowserRouter } from "react-router";
import Register from "./features/auth/Pages/Register";
import Login from "./features/auth/Pages/login";
import Dashboard from "./features/dashboard/Pages/Dashboard";


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
    }
])
