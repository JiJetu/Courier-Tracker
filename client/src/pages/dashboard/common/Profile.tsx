import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TbFidgetSpinner } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { currentUser, setUser } from "../../../redux/features/auth/auth.slice";
import { useUpdateProfileMutation } from "../../../redux/features/user/user.api";
import { imageUpload } from "../../../utiles/generateImageURL";

type TProfileForm = {
  name: string;
  image: FileList;
};

const Profile = () => {
  const user = useAppSelector(currentUser);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TProfileForm>({
    defaultValues: { name: user?.name },
  });
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const onSubmit = async (data: TProfileForm) => {
    const toastId = toast.loading("Updating profile...");
    let imageUrl = user?.image;

    try {
      if (data.image?.[0]) {
        imageUrl = await imageUpload(data.image[0]);
      }
      const updateUserInfo = { name: data.name, image: imageUrl };

      const res = await updateProfile(updateUserInfo).unwrap();
      console.log(res);

      const updatedUser = res?.user;
      dispatch(setUser({ user: updatedUser }));

      reset({ name: updatedUser.name });

      toast.success("Profile updated successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile", {
        id: toastId,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>CourierTracker | Profile</title>
      </Helmet>

      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-black">
        <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900 w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Update Profile
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col items-center gap-2">
              <img
                src={
                  user?.image
                    ? user.image
                    : `https://ui-avatars.com/api/?name=${user?.name}`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-purple-500 bg-gray-200 text-gray-900"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm">Image</label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Email (readonly)</label>
              <input
                type="email"
                disabled
                defaultValue={user?.email}
                className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-200 text-gray-900 cursor-not-allowed"
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-purple-500 w-full rounded-md py-3 text-white"
            >
              {isLoading ? (
                <TbFidgetSpinner className="animate-spin m-auto" />
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
