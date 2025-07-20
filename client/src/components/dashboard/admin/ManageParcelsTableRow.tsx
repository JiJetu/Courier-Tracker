import { useState } from "react";
import { TParcel } from "../../../type/parcel.types";
import { useNavigate } from "react-router-dom";
import AssignAgentModal from "./AssignAgentModal";
import { MdDelete } from "react-icons/md";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useDeleteParcelMutation } from "../../../redux/features/parcel/parcel.api";
import { toast } from "sonner";

const ManageParcelsTableRow = ({ parcel }: { parcel: TParcel }) => {
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteParcel, { isLoading }] = useDeleteParcelMutation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting...");

    try {
      const res = await deleteParcel(parcel._id);
      console.log(res);

      toast.success("Parcel deleted successfully", { id: toastId });
      setDeleteModal(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete", { id: toastId });
    }
  };

  return (
    <tr className="hover">
      <td>{parcel.parcelType}</td>
      <td>{parcel.pickupAddress}</td>
      <td>{parcel.deliveryAddress}</td>
      <td className="whitespace-nowrap min-w-[100px] max-w-[150px]">
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
      <td>
        <button
          onClick={() => setDeleteModal(true)}
          className="btn btn-xs btn-outline btn-error text-red-600 hover:text-white text-base"
        >
          <MdDelete />
        </button>
        {deleteModal && (
          <DeleteConfirmationModal
            onClose={() => setDeleteModal(false)}
            onConfirm={handleDelete}
            isLoading={isLoading}
          />
        )}
      </td>
    </tr>
  );
};

export default ManageParcelsTableRow;
