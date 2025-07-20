import { Helmet } from "react-helmet-async";
import Loading from "../../../components/loading/Loading";
import { TParcel } from "../../../type/parcel.types";
import { useGetMyParcelsQuery } from "../../../redux/features/parcel/parcel.api";
import ManageParcelsTableRow from "../../../components/dashboard/admin/ManageParcelsTableRow";
import { useEffect, useState } from "react";
import Pagination from "../../../components/pagination/Pagination";
import { socket } from "../../../utiles/socket";

const ITEMS_PER_PAGE = 7;

const ManageParcels = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isError, refetch } = useGetMyParcelsQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    socket.on("parcelAgentAssigned", () => refetch());
    socket.on("parcelStatusUpdated", () => refetch());

    return () => {
      socket.off("parcelAgentAssigned");
      socket.off("parcelStatusUpdated");
    };
  }, [refetch]);

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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.parcels?.map((parcel: TParcel) => (
              <ManageParcelsTableRow key={parcel._id} parcel={parcel} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={data?.data?.currentPage || 1}
        totalPages={data?.data?.totalPages || 1}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default ManageParcels;
