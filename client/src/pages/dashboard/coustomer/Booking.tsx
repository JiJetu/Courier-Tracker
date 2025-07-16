import { Helmet } from "react-helmet-async";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useCreateParcelMutation } from "../../../redux/features/parcel/parcel.api";

interface TParcelForm {
  pickupAddress: string;
  deliveryAddress: string;
  parcelType: string;
  amount: number;
  isCOD: boolean;
}

const Booking = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TParcelForm>();

  const [createParcel, { isLoading }] = useCreateParcelMutation();

  const onSubmit: SubmitHandler<TParcelForm> = async (data) => {
    try {
      await createParcel(data).unwrap();
      toast.success("Parcel booked successfully");
      reset();
      setOpen(false);
      navigate("/my-parcels");
    } catch (error: any) {
      toast.error(error?.data?.message || "Booking failed");
    }
  };

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

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Pickup Address"
                        className="input input-bordered w-full"
                        {...register("pickupAddress", {
                          required: "Pickup Address is required",
                        })}
                      />
                      {errors.pickupAddress && (
                        <p className="text-red-500 text-sm">
                          {errors.pickupAddress.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Delivery Address"
                        className="input input-bordered w-full"
                        {...register("deliveryAddress", {
                          required: "Delivery Address is required",
                        })}
                      />
                      {errors.deliveryAddress && (
                        <p className="text-red-500 text-sm">
                          {errors.deliveryAddress.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Parcel Type (e.g., Document, Box)"
                        className="input input-bordered w-full"
                        {...register("parcelType", {
                          required: "Parcel Type is required",
                        })}
                      />
                      {errors.parcelType && (
                        <p className="text-red-500 text-sm">
                          {errors.parcelType.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="number"
                        placeholder="Parcel Amount (BDT)"
                        className="input input-bordered w-full"
                        {...register("amount", {
                          required: "Amount is required",
                          valueAsNumber: true,
                        })}
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-sm">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          {...register("isCOD")}
                        />
                        Cash On Delivery (COD)?
                      </label>
                    </div>

                    <button
                      disabled={isLoading}
                      type="submit"
                      className="btn btn-primary w-full"
                    >
                      {isLoading ? "Booking..." : "Confirm Booking"}
                    </button>
                  </form>
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
