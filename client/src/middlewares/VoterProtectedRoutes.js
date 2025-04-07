import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

function VoterProtectedRoute() {
    const { token, role } = useAuth();

    if (!token || role !== "user") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default VoterProtectedRoute;
