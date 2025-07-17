import { Helmet } from "react-helmet-async";
import Loading from "../../../components/loading/Loading";
import { TUser } from "../../../type/parcel.types";
import { toast } from "sonner";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "../../../redux/features/admin/admin.api";

const ManageUsers = () => {
  const { data, isLoading } = useGetAllUsersQuery(undefined);
  const [updateStatus] = useUpdateUserStatusMutation();

  const handleStatusUpdate = async (user: TUser) => {
    const toastId = toast.loading("Updating user status...");
    const updateUserStatus = { id: user._id, isBlocked: !user.isBlocked };
    try {
      await updateStatus(updateUserStatus);
      toast.success(
        `User ${!user.isBlocked ? "blocked" : "unblocked"} successfully`,
        { id: toastId }
      );
    } catch {
      toast.error("Failed to update user status", { id: toastId });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md min-h-screen">
      <Helmet>
        <title>CourierTracker | Manage Users</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-4">👥 Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-purple-100 text-purple-700">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((user: TUser) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="capitalize">
                  {user.isBlocked ? "Blocked" : "Active"}
                </td>
                <td>
                  <button
                    onClick={() => handleStatusUpdate(user)}
                    className={`btn btn-xs ${
                      user.isBlocked ? "btn-success" : "btn-error"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
