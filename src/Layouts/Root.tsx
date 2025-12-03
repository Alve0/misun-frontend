import { Outlet } from "react-router";
import { useAuth } from "../Hooks/useAuth";

export default function Root() {
  const { signout } = useAuth();
  async function SignOut() {
    const resutl = await signout();
    console.log(resutl);
  }

  return (
    <div className="roboto">
      <button className="btn" onClick={SignOut}>
        Signout
      </button>
      <Outlet />
    </div>
  );
}
