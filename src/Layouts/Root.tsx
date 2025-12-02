import { Outlet } from "react-router";

export default function Root() {
  return (
    <div className="roboto">
      <Outlet />
    </div>
  );
}
