import { Helmet } from "react-helmet-async";
import Loading from "../../../components/loading/Loading";
import { TParcel } from "../../../type/parcel.types";
import { useGetMyParcelsQuery } from "../../../redux/features/parcel/parcel.api";
import ManageParcelsTableRow from "../../../components/dashboard/admin/ManageParcelsTableRow";

const ManageParcels = () => {
  const { data, isLoading, isError } = useGetMyParcelsQuery(undefined);

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Failed to load parcels</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md min-h-screen">
      <Helmet>
        <title>CourierTracker | Manage Parcels</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-4">📦 All Parcels</h1>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-purple-100 text-purple-700">
              <th>Type</th>
              <th>Pickup</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Agent</th>
              <th>Track</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {data?.parcels?.map((parcel: TParcel) => (
              <ManageParcelsTableRow key={parcel._id} parcel={parcel} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageParcels;
