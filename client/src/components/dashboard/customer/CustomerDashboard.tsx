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
import { useGetCustomerMetricsQuery } from "../../../redux/features/user/user.api";
import { useAppSelector } from "../../../redux/hooks";
import { currentUser } from "../../../redux/features/auth/auth.slice";

const CustomerDashboard = () => {
  const { data, isLoading, isError } = useGetCustomerMetricsQuery(undefined);
  const user = useAppSelector(currentUser);

  console.log(isError);

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Failed to load metrics</p>;

  const metrics = data?.data;
  return (
    <div className="p-4">
      <Helmet>
        <title>CourierTracker | Dashboard</title>
      </Helmet>

      <div className="flex justify-between">
        <h1 className="text-xl md:text-3xl font-bold mb-4">
          📊 Customer Dashboard
        </h1>
        <p className="text-lg font-semibold">🖐🏻Hey, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">
          📅 Today Bookings {metrics?.todayBookings}
        </h2>
        <h2 className="text-xl font-bold mb-4">📅 Last 10 Days Bookings</h2>
        <ResponsiveContainer width="95%" height={300}>
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
    </div>
  );
};

export default CustomerDashboard;
