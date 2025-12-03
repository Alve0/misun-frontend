import { Outlet } from "react-router";
import LoginImage from "../Assets/DrawKit-Vector-Illustration-ecommerce-02.png";

export default function Account() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center  p-6">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="hidden md:flex items-center justify-center w-1/2 bg-gray-50 p-6">
          <img
            src={LoginImage}
            alt="auth"
            className="w-full max-w-md object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
