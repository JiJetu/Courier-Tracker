import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { currentUser } from "../redux/features/auth/auth.slice";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector(currentUser);
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
