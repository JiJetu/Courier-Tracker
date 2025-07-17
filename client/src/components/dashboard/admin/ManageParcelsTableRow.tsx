import { useState } from "react";
import { TParcel } from "../../../type/parcel.types";
import { useNavigate } from "react-router-dom";
import AssignAgentModal from "./AssignAgentModal";

const ManageParcelsTableRow = ({ parcel }: { parcel: TParcel }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <tr className="hover">
      <td>{parcel.parcelType}</td>
      <td>{parcel.pickupAddress}</td>
      <td>{parcel.deliveryAddress}</td>
      <td>
        <span
          className={`badge badge-outline ${
            parcel.status === "Delivered"
              ? "badge-success"
              : parcel.status === "Failed"
              ? "badge-error"
              : "badge-info"
          }`}
        >
          {parcel.status}
        </span>
      </td>
      <td>{parcel.amount}৳</td>
      <td>
        {parcel.assignedAgent ? parcel.assignedAgent.name : "Not Assigned"}
      </td>
      <td>
        <button
          onClick={() => navigate(`/dashboard/parcel-track/${parcel._id}`)}
          className="btn btn-xs btn-outline btn-primary"
        >
          Track
        </button>
      </td>
      <td>
        <button onClick={() => setOpen(true)} className="btn btn-xs btn-accent">
          Assign
        </button>
        {open && (
          <AssignAgentModal parcel={parcel} closeModal={() => setOpen(false)} />
        )}
      </td>
    </tr>
  );
};

export default ManageParcelsTableRow;
