import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useForgotPasswordMutation } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import Meta from "../components/Meta";

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const { email } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isSuccess, message, isError } = useSelector(
    (state) => state.auth
  );

  const [forgotPassword, { isLoading: passwordLoading }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    //redeirect if logged in
    if (isSuccess && user) {
      //redirect
      navigate("/");
    }
  }, [isError, message, isSuccess, user, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    //validate email
    if (!email) {
      toast.error("Por favor ingresa tu email");
      return;
    } //regex for email validation

    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      toast.error("Por favor ingresa un email valido");
      return;
    }

    try {
      //dispatch login
      await forgotPassword({ email }).unwrap();
      toast.success(
        "Email enviado con instrucciones para recuperar tu contraseña"
      );
      setFormData({ email: "" });
      navigate("/");
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Meta title="Recuperar contraseña" />
      <div className="container">
        <section className="my-3 text-center">
          <h1>
            <FaUser />
            <br /> Recuperar contraseña
          </h1>
          <p>Por favor ingresa tu email</p>
        </section>

        <section>
          <form onSubmit={onSubmit}>
            <FormContainer>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Ingresa tu email"
                required
              />
            </FormContainer>
            <div className="text-center my-5">
              <button type="submit" className="btn btn-primary">
                Recuperar contraseña
              </button>
              {passwordLoading && <Loader />}
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default ForgotPassword;
