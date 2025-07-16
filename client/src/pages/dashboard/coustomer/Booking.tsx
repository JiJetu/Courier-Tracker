import { Helmet } from "react-helmet-async";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import BookingForm from "../../../components/dashboard/customer/BookingForm";

const Booking = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Helmet>
        <title>CourierTracker | Book Parcel</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen md:p-4 bg-gradient-to-r from-purple-600 to-purple-400">
        <h1 className="text-4xl font-bold text-white mb-8">
          Book Your Parcel 🚚
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-primary text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition"
        >
          Book Parcel Now
        </button>
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto md:ml-64">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                    Book Parcel 📦
                  </DialogTitle>
                  <BookingForm closeModal={() => setOpen(false)} />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Booking;
