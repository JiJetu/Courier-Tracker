import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen md:flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 bg-gray-100  min-h-screen dark:text-black">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
