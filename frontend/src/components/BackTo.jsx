import { useNavigate } from "react-router-dom";

function BackTo() {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <div className="mb-3 text-end">
      <button onClick={goBackHandler} className="btn btn-light border">
        Volver
      </button>
    </div>
  );
}

export default BackTo;
