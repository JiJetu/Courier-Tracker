import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateParcelMutation } from "../../../redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TParcelForm } from "../../../type/parcel.types";

const BookingForm = ({ closeModal }: { closeModal: () => void }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TParcelForm>();

  const [createParcel, { isLoading }] = useCreateParcelMutation();

  const onSubmit: SubmitHandler<TParcelForm> = async (data) => {
    const toastId = toast.loading("Parcel is booking..........");
    try {
      const res = await createParcel(data);
      console.log(res);
      toast.success(res?.data?.message || "Parcel booked successful", {
        id: toastId,
        duration: 2000,
      });
      reset();
      closeModal();
      navigate("/dashboard/my-parcels");
    } catch (error: any) {
      toast.error(error?.data?.message || "Booking failed", {
        id: toastId,
        duration: 2000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("pickupAddress", {
          required: "Pickup Address is required",
        })}
        className="input input-bordered w-full"
        placeholder="Pickup Address"
      />
      {errors.pickupAddress && (
        <p className="text-red-500 text-sm">{errors.pickupAddress.message}</p>
      )}

      <input
        {...register("deliveryAddress", {
          required: "Delivery Address is required",
        })}
        className="input input-bordered w-full"
        placeholder="Delivery Address"
      />
      {errors.deliveryAddress && (
        <p className="text-red-500 text-sm">{errors.deliveryAddress.message}</p>
      )}

      <select
        {...register("parcelType", { required: "Parcel Type is required" })}
        className="select select-bordered w-full"
      >
        <option value="">Select Parcel Type</option>
        <option value="Document">Document</option>
        <option value="Box">Box</option>
        <option value="Fragile Item">Fragile Item</option>
        <option value="Grocery">Grocery</option>
        <option value="Others">Others</option>
      </select>
      {errors.parcelType && (
        <p className="text-red-500 text-sm">{errors.parcelType.message}</p>
      )}

      <input
        type="number"
        {...register("amount", {
          required: "Amount is required",
          valueAsNumber: true,
        })}
        className="input input-bordered w-full"
        placeholder="Parcel Amount (BDT)"
      />
      {errors.amount && (
        <p className="text-red-500 text-sm">{errors.amount.message}</p>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          {...register("isCOD")}
        />
        Cash On Delivery (COD)?
      </label>

      <button
        disabled={isLoading}
        type="submit"
        className="btn btn-primary w-full"
      >
        {isLoading ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
};

export default BookingForm;
