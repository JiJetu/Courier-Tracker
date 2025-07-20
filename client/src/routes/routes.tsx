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
import CustomerRoute from "./CustomerRoute";
import ProtectedRoute from "./ProtectedRoute";
import ManageUsers from "../components/dashboard/admin/ManageUsers";
import Dashboard from "../pages/dashboard/common/Dashboard";
import Profile from "../pages/dashboard/common/Profile";
import NotFound from "../pages/errror/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
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
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "parcel-track/:id",
        element: <ParcelTrack />,
      },
      // customer
      {
        path: "book-parcel",
        element: (
          <CustomerRoute>
            <Booking />
          </CustomerRoute>
        ),
      },
      {
        path: "my-parcels",
        element: (
          <CustomerRoute>
            <MyParcels />
          </CustomerRoute>
        ),
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
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
