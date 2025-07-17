import { ReactNode } from "react";
import { useAppSelector } from "../redux/hooks";
import { currentUser } from "../redux/features/auth/auth.slice";
import { Navigate } from "react-router-dom";
import { userRole } from "../constant";

const CustomerRoute = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector(currentUser);
  if (user?.role !== userRole.Customer) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default CustomerRoute;
