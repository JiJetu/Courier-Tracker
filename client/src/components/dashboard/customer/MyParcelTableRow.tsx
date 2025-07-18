import { useNavigate } from "react-router-dom";
import { TParcel } from "../../../type/parcel.types";

const MyParcelTableRow = ({ parcel }: { parcel: TParcel }) => {
  const navigate = useNavigate();

  return (
    <tr key={parcel?._id} className="hover">
      <td>{parcel?.parcelType}</td>
      <td>{parcel?.pickupAddress}</td>
      <td>{parcel?.deliveryAddress}</td>
      <td className="whitespace-nowrap min-w-[100px] max-w-[150px]">
        <span
          className={`text-white badge ${
            parcel?.status === "Delivered"
              ? "badge-success"
              : parcel?.status === "In Transit"
              ? "badge-warning"
              : parcel?.status === "Picked Up"
              ? "badge-info"
              : parcel?.status === "Failed"
              ? "badge-error"
              : parcel?.status === "Booked"
              ? "badge-primary"
              : "badge-neutral"
          }`}
        >
          {parcel?.status}
        </span>
      </td>
      <td>{parcel?.amount}৳</td>
      <td>{parcel?.isCOD ? "✅" : "❌"}</td>
      <td className="flex gap-2">
        {(parcel?.status === "Picked Up" ||
          parcel?.status === "In Transit") && (
          <button
            onClick={() => navigate(`/dashboard/parcel-track/${parcel._id}`)}
            className="btn btn-xs btn-outline btn-primary"
          >
            Track
          </button>
        )}

        {(parcel?.status === "Delivered" || parcel?.isCOD === false) && (
          <button className="btn btn-xs btn-outline btn-warning">Pay</button>
        )}

        {parcel?.status !== "Picked Up" &&
          parcel?.status !== "In Transit" &&
          parcel?.status !== "Delivered" &&
          parcel?.isCOD !== false && (
            <span className="text-xs text-gray-400">N/A</span>
          )}
      </td>
    </tr>
  );
};

export default MyParcelTableRow;
