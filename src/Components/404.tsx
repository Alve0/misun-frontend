import { useNavigate } from "react-router";
import ErrorImage from "../Assets/404-pages.jpg";

export default function Error() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };
  return (
    <div className=" flex flex-col w-full justify-center items-center">
      <img src={ErrorImage} />
      <button className="btn items-center" onClick={goBack}>
        Go Back
      </button>
    </div>
  );
}
