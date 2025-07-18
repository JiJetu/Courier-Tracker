import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useUpdateParcelStatusMutation } from "../../../redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { TParcel } from "../../../type/parcel.types";

type TParcelStatusModalProps = { parcel: TParcel; closeModal: () => void };

const getNextStatuses = (currentStatus: string): string[] => {
  const statusMap: Record<string, string[]> = {
    Booked: ["Picked Up", "Failed"],
    "Picked Up": ["In Transit", "Failed"],
    "In Transit": ["Delivered", "Failed"],
    Delivered: [],
    Failed: [],
  };
  return statusMap[currentStatus] || [];
};

const ParcelStatusModal = ({ parcel, closeModal }: TParcelStatusModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateStatus, { isLoading }] = useUpdateParcelStatusMutation();

  const nextStatuses = getNextStatuses(parcel.status);

  console.log(nextStatuses);

  const handleUpdate = async () => {
    console.log(selectedStatus);
    if (!selectedStatus || selectedStatus === "Booked")
      return toast.error("Select proper status");

    const toastId = toast.loading("Updating status......");
    const updatedStatus = { id: parcel._id, status: selectedStatus };

    try {
      const res = await updateStatus(updatedStatus);
      console.log(res);
      toast.success("Status updated", { id: toastId });
      closeModal();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status", {
        id: toastId,
      });
    }
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl">
                <DialogTitle className="text-lg font-bold mb-4">
                  Update Parcel Status
                </DialogTitle>

                <select
                  className="w-full p-2 mb-4 border rounded"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  {["Picked Up", "In Transit", "Delivered", "Failed"].map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                        disabled={
                          !nextStatuses.includes(status) && status !== "Failed"
                        }
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>

                <button
                  disabled={isLoading || nextStatuses.length < 1}
                  onClick={handleUpdate}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? "Updating..." : "Update Status"}
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ParcelStatusModal;
