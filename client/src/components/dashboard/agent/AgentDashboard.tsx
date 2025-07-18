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
import { useGetAgentMetricsQuery } from "../../../redux/features/user/user.api";
import { useAppSelector } from "../../../redux/hooks";
import { currentUser } from "../../../redux/features/auth/auth.slice";

const AgentDashboard = () => {
  const { data, isLoading, isError } = useGetAgentMetricsQuery(undefined);
  const user = useAppSelector(currentUser);

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
          📊 Agent Dashboard
        </h1>
        <p className="text-lg font-semibold">
          🖐🏻Hey, <span className="uppercase text-purple-600">{user?.role}</span>{" "}
          {user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Assigned Parcels</h2>
          <p className="text-2xl text-purple-600">{metrics?.totalAssigned}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Delivered</h2>
          <p className="text-2xl text-green-600">{metrics?.delivered}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Failed</h2>
          <p className="text-2xl text-red-600">{metrics?.failed}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">
          📅 Todays Assign {metrics?.todayAssigned}
        </h2>
        <h2 className="text-xl font-bold mb-4">
          📅 Last 10 Days Bookings {metrics?.last10DaysStats}
        </h2>
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

export default AgentDashboard;
