import AdminDashboard from "../../../components/dashboard/admin/AdminDashboard";
import { userRole } from "../../../constant";
import { currentUser } from "../../../redux/features/auth/auth.slice";
import { useAppSelector } from "../../../redux/hooks";

const Dashboard = () => {
  const user = useAppSelector(currentUser);
  return (
    <div>
      {user?.role === userRole.Admin ? (
        <AdminDashboard />
      ) : (
        <h1>This is Dashboard component</h1>
      )}
    </div>
  );
};

export default Dashboard;
