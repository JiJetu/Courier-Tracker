import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import {
  useGetActiveAssignedParcelsQuery,
  useUpdateParcelLocationMutation,
} from "../../../redux/features/parcel/parcel.api";
import { TParcel } from "../../../type/parcel.types";
import Loading from "../../../components/loading/Loading";

const LiveTracking = () => {
  const { data, isLoading } = useGetActiveAssignedParcelsQuery(undefined);
  const [selectedParcel, setSelectedParcel] = useState<TParcel | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 23.8103,
    lng: 90.4125,
  });

  const [trackParcel, { isLoading: isTracking }] =
    useUpdateParcelLocationMutation();

  useEffect(() => {
    const geoId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(geoId);
  }, []);

  const handleStartTracking = async () => {
    if (!selectedParcel) return toast.error("Select a parcel first");

    const toastId = toast.loading("Sending location updates...");
    try {
      await trackParcel({
        id: selectedParcel._id,
        lat: currentPosition.lat,
        lng: currentPosition.lng,
      }).unwrap();
      toast.success("Location updated", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update location", {
        id: toastId,
      });
    }
  };

  const assignedParcels = data?.parcels?.filter((parcel: TParcel) =>
    ["Picked Up", "In Transit"].includes(parcel.status)
  );

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <Helmet>
        <title>CourierTracker | Live Tracking</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">Live Tracking 🚚</h1>

      <select
        className="select select-bordered mb-4 w-full"
        onChange={(e) => {
          const parcel = assignedParcels?.find(
            (p: TParcel) => p._id === e.target.value
          );
          setSelectedParcel(parcel || null);
        }}
      >
        <option value="">Select Parcel</option>
        {assignedParcels?.map((parcel: TParcel) => (
          <option key={parcel._id} value={parcel._id}>
            track-{parcel._id.slice(0, 7)} {parcel.parcelType} ({parcel.status})
          </option>
        ))}
      </select>

      <div className="h-[400px] w-full rounded-lg overflow-hidden mb-4">
        <MapContainer
          center={currentPosition}
          zoom={14}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={currentPosition}>
            <Popup>Current Location 🚚</Popup>
          </Marker>
        </MapContainer>
      </div>

      <button
        disabled={isTracking || !selectedParcel}
        onClick={handleStartTracking}
        className="btn btn-primary w-full"
      >
        {isTracking ? "Sending location..." : "Update Location"}
      </button>
    </div>
  );
};

export default LiveTracking;
