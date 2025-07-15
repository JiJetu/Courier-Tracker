import { ReactNode } from "react";
import { useAppSelector } from "../redux/hooks";
import { currentUser } from "../redux/features/auth/auth.slice";
import { Navigate } from "react-router-dom";

const AgentRoute = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector(currentUser);
  if (user?.role !== "agent") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AgentRoute;
