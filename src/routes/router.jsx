import { createBrowserRouter, Navigate, redirect } from "react-router";

import App from "../App";
import Login from "../views/login/Login";
import ErrorPage from "../components/ErrorPage";
import Dashboard from "../views/dashboard/Dashboard";

import UserList from "../views/user/UserList";
import AuthList from "../views/auth/AuthList";
import RoleList from "../views/auth/RoleList";

const userAllRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/user/list",
    element: <UserList />,
  },{
    path: "/auth/list",
    element: <AuthList />,
  },
  {
    path: "/role/list",
    element: <RoleList />, 
  }
]

let filterRoutes = userAllRoutes.filter(item => true)

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    loader: () => {
      const token = localStorage.getItem("token");
      if(token){
        return redirect("/dashboard");
      }
      return null
    },
  },
  {
    path: "/",
    element: <App />,
    loader: () => {
      const token = localStorage.getItem("token"); 
      if(!token){
        return redirect("/login"); 
      }
      return null
    },
    children: filterRoutes,
  },
  {
    path: "*",
    element: <ErrorPage errorCode={404}  />,
    loader: () => {
      const token = localStorage.getItem("token"); 
      if(!token){
        return redirect("/login"); 
      }
      return null
    }
  }
]);

export default router;