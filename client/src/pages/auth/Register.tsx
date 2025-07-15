import { Helmet } from "react-helmet-async";
import { useRegisterMutation } from "../../redux/features/auth/auth.api";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GiDeliveryDrone } from "react-icons/gi";
import { TbFidgetSpinner } from "react-icons/tb";
import { toast } from "sonner";
import { imageUpload } from "../../utiles/generateImageURL";
import { useAppSelector } from "../../redux/hooks";
import { currentUser } from "../../redux/features/auth/auth.slice";

type TFormData = {
  name: string;
  email: string;
  password: string;
  role: "agent" | "customer";
  image: FileList;
};

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const loggedUser = useAppSelector(currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TFormData>();

  const onSubmit = async (data: TFormData) => {
    setLoading(true);
    const toastId = toast.loading("Registering.......");
    console.log(data);

    try {
      const imageFile = data.image[0];
      const image_url = await imageUpload(imageFile);
      setLoading(false);

      const userInfo = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        image: image_url,
      };

      const res: any = await registerUser(userInfo);

      if (res?.error?.status === 409) {
        toast.error(res?.error?.data?.message, {
          id: toastId,
          duration: 2000,
        });
        return navigate("/login");
      } else if (res?.error?.status && res?.error?.status !== 201) {
        return toast.error(res?.error?.data?.message, {
          id: toastId,
          duration: 2000,
        });
      }

      toast.success(res?.data?.message || "User created successfully", {
        id: toastId,
        duration: 2000,
      });
      reset();
      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  if (loggedUser) return <Navigate to={"/"} />;

  return (
    <>
      <Helmet>
        <title>CourierTracker | Registration</title>
      </Helmet>
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-black">
        <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
          <div className="mb-8 text-center">
            <h1 className="my-3 text-4xl font-bold">Sign Up</h1>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
              Welcome to
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-mono font-bold">
                <GiDeliveryDrone /> CourierTracker
              </span>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter Your Name Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-purple-500 bg-gray-200 text-gray-900"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block mb-2 text-sm">
                  Select Image:
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  {...register("image", { required: "Image is required" })}
                />
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Role
                </label>
                <select
                  {...register("role", {
                    required: "Role is required",
                  })}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-purple-500 bg-gray-200 text-gray-900"
                >
                  <option value="">Select role</option>
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                </select>
                {errors.role && (
                  <p className="text-red-500">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter Your Email Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-purple-500 bg-gray-200 text-gray-900"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="text-sm mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="*******"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-purple-500 bg-gray-200 text-gray-900"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                disabled={loading || isLoading}
                type="submit"
                className="bg-purple-500 w-full rounded-md py-3 text-white"
              >
                {isLoading || loading ? (
                  <TbFidgetSpinner className="animate-spin m-auto" />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>

          <p className="px-6 pt-4 text-sm text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="hover:underline hover:text-purple-500 text-gray-600"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
