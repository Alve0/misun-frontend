import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";
import { useEffect } from "react";
import Loading from "../Loading";

export default function Register() {
  const navigate = useNavigate();
  const { googleLogin, user, createUser, profileUpdate, loading } = useAuth();
  const axiosInstance = useAxios();

  interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const password = watch("password");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const saveUserToDB = async (userData: {
    name: string;
    email: string;
    role: string;
  }) => {
    try {
      const response = await axiosInstance.post("/users", userData);
      console.log("User saved to DB:", response.data);
    } catch (err: any) {
      console.error("Failed to save user:", err.response?.data || err.message);

      throw err;
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createUser(data.email, data.password);

      if (result?.user) {
        await profileUpdate(data.name, "");

        await saveUserToDB({
          name: data.name,
          email: data.email,
          role: data.role || "student",
        });

        navigate("/");
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError("root", { message: err.message || "Failed to register" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();

      if (result?.user) {
        const { displayName, email } = result.user;

        await saveUserToDB({
          name: displayName || "Google User",
          email: email!,
          role: "student",
        });

        navigate("/");
      }
    } catch (err: any) {
      console.error("Google login failed:", err);
      setError("root", { message: "Google login failed" });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>

        {/* Show server/auth errors */}
        {errors.root && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.root.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              {...register("role", { required: "Please select a role" })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">-- Select Role --</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg"
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-black font-bold underline hover:no-underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
