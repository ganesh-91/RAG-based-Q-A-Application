import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { AuthContext } from "../context/auth";

export const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="w-full h-screen flex">
      <Sidebar user={user} onLogout={logout} />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};
