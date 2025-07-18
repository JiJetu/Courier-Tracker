import AdminDashboard from "../../../components/dashboard/admin/AdminDashboard";
import AgentDashboard from "../../../components/dashboard/agent/AgentDashboard";
import CustomerDashboard from "../../../components/dashboard/customer/CustomerDashboard";
import { userRole } from "../../../constant";
import { currentUser } from "../../../redux/features/auth/auth.slice";
import { useAppSelector } from "../../../redux/hooks";

const Dashboard = () => {
  const user = useAppSelector(currentUser);
  return (
    <div>
      {user?.role === userRole.Admin && <AdminDashboard />}
      {user?.role === userRole.Agent && <AgentDashboard />}
      {user?.role === userRole.Customer && <CustomerDashboard />}
    </div>
  );
};

export default Dashboard;
