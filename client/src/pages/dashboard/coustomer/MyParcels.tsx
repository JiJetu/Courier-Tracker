import { Helmet } from "react-helmet-async";
import { useGetMyParcelsQuery } from "../../../redux/features/parcel/parcel.api";
import { TParcel } from "../../../type/parcel.types";
import Loading from "../../../components/loading/Loading";
import MyParcelTableRow from "../../../components/dashboard/customer/MyParcelTableRow";
import { useState } from "react";
import Pagination from "../../../components/pagination/Pagination";

const ITEMS_PER_PAGE = 7;

const MyParcels = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isError } = useGetMyParcelsQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500">Failed to fetch parcels ❌</p>
    );

  return (
    <>
      <Helmet>
        <title>CourierTracker | My Parcels</title>
      </Helmet>
      <div className="p-4 bg-white rounded-lg shadow-md min-h-screen">
        <h1 className="text-2xl font-bold mb-4">📦 My Parcels</h1>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-purple-100 text-purple-700">
                <th>Type</th>
                <th>Pickup</th>
                <th>Delivery</th>
                <th>Status</th>
                <th>Amount</th>
                <th>COD</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.parcels?.map((parcel: TParcel) => (
                <MyParcelTableRow parcel={parcel} />
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
    </>
  );
};

export default MyParcels;
