import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

type TDeleteConfirmationModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
};

const DeleteConfirmationModal = ({
  onClose,
  onConfirm,
  isLoading,
}: TDeleteConfirmationModalProps) => {
  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                <DialogTitle className="text-lg font-bold text-red-500">
                  ❗Confirm Deletion
                </DialogTitle>
                <p>Are you sure you want to delete this parcel?</p>
                <div className="flex gap-3 justify-between items-center">
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="btn btn-error"
                  >
                    {isLoading ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button onClick={onClose} className="btn btn-neutral">
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteConfirmationModal;
