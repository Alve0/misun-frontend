import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";
import Loading from "../Loading";

export default function Login() {
  const { login, googleLogin, user, loading } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{
    email: string;
    password: string;
  }>();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const saveUserToDB = async (firebaseUser: any) => {
    const userData = {
      name: firebaseUser.displayName || "Google User",
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL || "",
      role: "student",
    };

    try {
      await axiosInstance.post("/users", userData);
    } catch (err: any) {
      if (
        err.response?.status !== 409 &&
        err.response?.data?.message !== "User already exists"
      ) {
        console.error("Failed to save user to DB:", err);
      }
    }
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setError("root", {
        message:
          err?.message?.includes("wrong-password") ||
          err?.message?.includes("user-not-found")
            ? "Invalid email or password"
            : "Login failed. Try again.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      if (result?.user) {
        await saveUserToDB(result.user);
      }
    } catch (err: any) {
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
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </h2>

        {errors.root && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg mb-4"
          >
            {errors.root.message}
          </motion.p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password too short" },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-semibold py-3.5 rounded-lg hover:bg-gray-900 transition disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 bg-white">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-400 py-3.5 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70"
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-black underline hover:no-underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
