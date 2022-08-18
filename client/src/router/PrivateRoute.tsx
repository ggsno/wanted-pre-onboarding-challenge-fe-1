import React from "react";
import storage from "../utils/storage";
import { Navigate, Outlet } from "react-router-dom";
import path from "./routerPath";

const PrivateRoute = () => {
  return storage.get({ key: "token" }) ? (
    <Outlet />
  ) : (
    <Navigate to={path.LOGIN} />
  );
};

export default PrivateRoute;
