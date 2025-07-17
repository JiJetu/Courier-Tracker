import { Helmet } from "react-helmet-async";
import { useState } from "react";
import ParcelStatusModal from "../../../components/dashboard/agent/ParcelStatusModal";
import { TParcel } from "../../../type/parcel.types";
import { useGetMyParcelsQuery } from "../../../redux/features/parcel/parcel.api";
import Loading from "../../../components/loading/Loading";

const AssignedParcels = () => {
  const { data, isLoading } = useGetMyParcelsQuery(undefined);
  const [selectedParcel, setSelectedParcel] = useState<TParcel | null>(null);

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <Helmet>
        <title>CourierTracker | My Assigned Parcels</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">Assigned Parcels 📦</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.parcels?.map((parcel: TParcel) => (
          <div
            key={parcel?._id}
            className="bg-white shadow-lg p-4 rounded-lg border border-purple-200"
          >
            <h2 className="text-lg font-bold mb-2">{parcel?.parcelType}</h2>
            <p>
              Status: <span className="font-semibold">{parcel.status}</span>
            </p>
            <p>Pickup: {parcel?.pickupAddress}</p>
            <p>Delivery: {parcel?.deliveryAddress}</p>
            <button
              onClick={() => setSelectedParcel(parcel)}
              className="mt-3 btn btn-sm btn-primary w-full"
            >
              Update Status
            </button>
          </div>
        ))}
      </div>

      {selectedParcel && (
        <ParcelStatusModal
          parcel={selectedParcel}
          closeModal={() => setSelectedParcel(null)}
        />
      )}
    </div>
  );
};

export default AssignedParcels;
