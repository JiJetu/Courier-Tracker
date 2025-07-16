import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import ProtectedRoute from "../routes/ProtectedRoute";

const DashboardLayout = () => {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen md:flex">
        <Sidebar />

        <div className="flex-1 md:ml-64 bg-gray-100  min-h-screen">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
