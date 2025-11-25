import React from "react";
import { Navigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../actions/authApi";
import LoadingScreen from "../../components/LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: user, isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
