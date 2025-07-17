import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { TParcel, TUser } from "../../../type/parcel.types";
import { useGetAllAgentsQuery } from "../../../redux/features/admin/admin.api";
import { useAssignParcelMutation } from "../../../redux/features/parcel/parcel.api";
import Loading from "../../loading/Loading";

type TAssignAgentModalProps = {
  parcel: TParcel;
  closeModal: () => void;
};

const AssignAgentModal = ({ parcel, closeModal }: TAssignAgentModalProps) => {
  const [agentId, setAgentId] = useState<string>(
    parcel.assignedAgent?._id || ""
  );
  const { data: agents, isLoading: isAgentLoading } =
    useGetAllAgentsQuery(undefined);
  const [assignAgent, { isLoading }] = useAssignParcelMutation();

  const handleAssign = async () => {
    if (!agentId) return toast.error("Please select an agent!");
    const toastId = toast.loading("Assigning agent...");
    try {
      await assignAgent({ id: parcel._id, agentId }).unwrap();
      toast.success("Agent assigned successfully", { id: toastId });
      closeModal();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign agent", {
        id: toastId,
      });
    }
  };

  if (isAgentLoading) return <Loading />;

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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl space-y-4">
                <DialogTitle className="text-lg font-bold">
                  Assign Agent 🚚
                </DialogTitle>

                <select
                  className="select select-bordered w-full"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                >
                  <option value="">Select Agent</option>
                  {agents?.agents?.map((agent: TUser) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} - {agent.email}
                    </option>
                  ))}
                </select>

                <button
                  disabled={isLoading || !agentId}
                  onClick={handleAssign}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? "Assigning..." : "Confirm Assignment"}
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AssignAgentModal;
