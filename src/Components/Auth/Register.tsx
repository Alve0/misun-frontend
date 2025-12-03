import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../Hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { googleLogin, user, createUser, profileUpdate } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>();

  const password = watch("password");

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const result = await createUser(data.email, data.password);
      console.log(result);
      if (result) {
        await profileUpdate(data.name, "");
      }
    } catch (err) {
      throw err;
    }
  };

  user != null ? navigate("/") : "";

  async function GoogleLogin() {
    const result = await googleLogin();
    console.log(result);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-black/30"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name?.message as string}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-black/30"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email?.message as string}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-black/30"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password?.message as string}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-black/30"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword?.message as string}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-2 rounded-lg font-semibold"
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>

        {/* Google Button */}
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={GoogleLogin}
            className="flex items-center gap-2 border p-2 w-full justify-center rounded-lg hover:bg-gray-100 transition"
          >
            <FcGoogle size={22} /> Continue with Google
          </button>
        </div>

        {/* Link to login */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-semibold underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
