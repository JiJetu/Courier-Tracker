import { useParams } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Helmet } from "react-helmet-async";
import { useGetParcelByIdQuery } from "../../../redux/features/parcel/parcel.api";
import Loading from "../../../components/loading/Loading";
import { TParcel } from "../../../type/parcel.types";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const ParcelTrack = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetParcelByIdQuery(id!);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  });

  if (isLoading || !isLoaded) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500">
        Failed to load tracking data ❌
      </p>
    );

  const parcel = data?.parcel as TParcel;
  const coordinates = parcel?.trackingCoordinates || [];
  const latest = coordinates[coordinates.length - 1];

  return (
    <>
      <Helmet>
        <title>CourierTracker | Track Parcel</title>
      </Helmet>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">📍 Live Tracking Parcel</h1>
        <p className="mb-2">
          <b>Status:</b> {parcel?.status}
        </p>
        <p className="mb-2">
          <b>Pickup:</b> {parcel?.pickupAddress}
        </p>
        <p className="mb-2">
          <b>Delivery:</b> {parcel?.deliveryAddress}
        </p>

        {latest ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: latest.lat, lng: latest.lng }}
            zoom={14}
          >
            <Marker position={{ lat: latest.lat, lng: latest.lng }} />
            <Polyline
              path={coordinates.map((point) => ({
                lat: point.lat,
                lng: point.lng,
              }))}
              options={{ strokeColor: "#8b5cf6", strokeWeight: 4 }}
            />
          </GoogleMap>
        ) : (
          <p className="text-center text-gray-500">
            Tracking not started yet ❌
          </p>
        )}
      </div>
    </>
  );
};

export default ParcelTrack;
