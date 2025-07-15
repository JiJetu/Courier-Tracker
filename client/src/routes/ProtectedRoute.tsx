import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { currentUserToken } from "../redux/features/auth/auth.slice";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const token = useAppSelector(currentUserToken);

  if (!token) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
