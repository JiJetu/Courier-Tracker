import { Helmet } from "react-helmet-async";
import Loading from "../../../components/loading/Loading";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetAdminMetricsQuery } from "../../../redux/features/admin/admin.api";
import { currentUser } from "../../../redux/features/auth/auth.slice";
import { useAppSelector } from "../../../redux/hooks";
import DownloadReportButton from "../../downloadReportButton/DownloadReportButton";

const AdminDashboard = () => {
  const { data, isLoading, isError } = useGetAdminMetricsQuery(undefined);
  const user = useAppSelector(currentUser);

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Failed to load metrics</p>;

  const metrics = data?.data;

  return (
    <div className="p-4">
      <Helmet>
        <title>CourierTracker | Admin Dashboard</title>
      </Helmet>

      <div className="flex justify-between">
        <h1 className="text-xl md:text-3xl font-bold mb-4">
          📊 Dashboard Overview
        </h1>
        <p className="text-lg font-semibold">
          🖐🏻Hey, <span className="uppercase text-purple-600">{user?.role}</span>{" "}
          {user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Total Bookings</h2>
          <p className="text-2xl text-purple-600">{metrics?.totalBookings}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Delivered</h2>
          <p className="text-2xl text-green-600">
            {metrics?.deliveredBookings}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Failed</h2>
          <p className="text-2xl text-red-600">{metrics?.failedBookings}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Today's Bookings</h2>
          <p className="text-2xl text-purple-600">{metrics?.todayBookings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">COD Amount (৳)</h2>
          <p className="text-3xl text-blue-600">
            {metrics?.totalCODAmount?.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Total Booking Amount (৳)</h2>
          <p className="text-3xl text-green-600">
            {metrics?.totalBookingAmount?.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mt-8 flex flex-col-reverse lg:flex-row gap-4">
        <div className="flex-1">
          <div className="md:flex justify-between items-center mb-7 md:mb-4">
            <h2 className="text-xl font-bold mb-3">
              📅 Bookings - Last 10 Days
            </h2>
            <div className="flex gap-3">
              <DownloadReportButton type="csv" />
              <DownloadReportButton type="pdf" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.last10DaysStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-lg font-bold">Total Customer</h2>
            <p className="text-2xl text-purple-600">
              {metrics?.totalCustomers}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center mt-3">
            <h2 className="text-lg font-bold">Total Agent</h2>
            <p className="text-2xl text-red-600">{metrics?.totalAgents}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
