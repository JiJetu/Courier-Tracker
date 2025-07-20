import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useGetParcelByIdQuery } from "../../../redux/features/parcel/parcel.api";
import { TParcel } from "../../../type/parcel.types";
import Loading from "../../../components/loading/Loading";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "../../../utiles/socket";
import { userRole } from "../../../constant";
import { useAppSelector } from "../../../redux/hooks";
import { currentUser } from "../../../redux/features/auth/auth.slice";

const ParcelTrack = () => {
  const user = useAppSelector(currentUser);
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetParcelByIdQuery(id!);
  const [liveParcel, setLiveParcel] = useState<TParcel | null>(null);

  useEffect(() => {
    if (!id) return;
    if (data?.parcel) setLiveParcel(data.parcel);

    // join socket room
    socket.emit("join", id);

    // listen for parcel updates
    socket.on("parcelLocationUpdated", (updatedParcel) => {
      setLiveParcel(updatedParcel);
    });

    // cleanup on unmount
    return () => {
      socket.emit("leave", id);
      socket.off("parcelLocationUpdated");
    };
  }, [id, data?.parcel]);

  // const parcel = data?.parcel as TParcel;
  const coordinates = liveParcel?.trackingCoordinates || [];

  const latest =
    coordinates.length > 0 ? coordinates[coordinates.length - 1] : null;
  // const coordinates = parcel.trackingCoordinates || [];

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500">Failed to load tracking data</p>
    );

  if (user?.role === userRole.Agent) return <Navigate to="/dashboard" />;

  return (
    <>
      <Helmet>
        <title>CourierTracker | Track Parcel</title>
      </Helmet>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">📍 Live Tracking Parcel</h1>

        <div className="mb-4 space-y-2 text-gray-700">
          <p>
            <b>Status:</b> {liveParcel?.status}
          </p>
          <p>
            <b>Pickup:</b> {liveParcel?.pickupAddress}
          </p>
          <p>
            <b>Delivery:</b> {liveParcel?.deliveryAddress}
          </p>
          {liveParcel?.assignedAgent && (
            <p>
              <b>Agent:</b> {liveParcel?.assignedAgent?.name}
            </p>
          )}
        </div>

        {latest ? (
          <div className="relative z-0 h-[400px] w-full mt-4 rounded-lg overflow-hidden">
            <MapContainer
              center={{ lat: latest.lat, lng: latest.lng }}
              zoom={14}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                referrerPolicy="no-referrer"
              />
              <Marker position={{ lat: latest.lat, lng: latest.lng }}>
                <Popup>Current Location 🚚</Popup>
              </Marker>
              <Polyline
                positions={coordinates.map((coord) => [coord.lat, coord.lng])}
                pathOptions={{ color: "#8b5cf6", weight: 4 }}
              />
            </MapContainer>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            Tracking not started yet!!
          </p>
        )}
      </div>
    </>
  );
};

export default ParcelTrack;
