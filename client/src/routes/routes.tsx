import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardLayout from "../layout/DashboardLayout";
import Booking from "../pages/dashboard/coustomer/Booking";
import MyParcels from "../pages/dashboard/coustomer/MyParcels";
import ParcelTrack from "../pages/dashboard/common/ParcelTrack";
import AgentRoute from "./AgentRoute";
import AssignedParcels from "../pages/dashboard/agent/AssignedParcels";
import LiveTracking from "../pages/dashboard/agent/LiveTracking";
import AdminRoute from "./AdminRoute";
import ManageParcels from "../pages/dashboard/admin/ManageParcels";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // protected
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <h1>Dashboard</h1>,
      },
      {
        path: "parcel-track/:id",
        element: <ParcelTrack />,
      },
      {
        path: "book-parcel",
        element: <Booking />,
      },
      {
        path: "my-parcels",
        element: <MyParcels />,
      },
      // agent
      {
        path: "my-assigned-parcels",
        element: (
          <AgentRoute>
            <AssignedParcels />
          </AgentRoute>
        ),
      },
      {
        path: "live-tracking",
        element: (
          <AgentRoute>
            <LiveTracking />
          </AgentRoute>
        ),
      },
      // admin
      {
        path: "manage-parcels",
        element: (
          <AdminRoute>
            <ManageParcels />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
