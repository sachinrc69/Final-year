import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

function AdminProtectedRoute() {
    const { token, role } = useAuth();

    if (!token || role !== "admin") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default AdminProtectedRoute;
