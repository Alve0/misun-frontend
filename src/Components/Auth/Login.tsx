import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";

import { useAuth } from "../../Hooks/useAuth";

export default function Login() {
  const { googleLogin, user, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await login(data.email, data.password);
      console.log(result);
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full bg-black text-white py-2 rounded-lg font-semibold"
          type="submit"
        >
          Login
        </motion.button>
      </form>

      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={GoogleLogin}
          className="flex items-center gap-2 border p-2 w-full justify-center rounded-lg hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} /> Continue with Google
        </button>
      </div>

      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-black font-semibold underline">
          Register
        </Link>
      </p>
    </motion.div>
  );
}
