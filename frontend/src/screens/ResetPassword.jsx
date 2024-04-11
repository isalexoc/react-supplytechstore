import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useResetPasswordMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Meta from "../components/Meta";

const ResetPassword = () => {
  const { id, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resetPassword, { isLoading: loadingResetPassword }] =
    useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    } else {
      try {
        const res = await resetPassword({
          id,
          token,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Contraseña actualizada");
        navigate("/profile");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title="Actualizar Contraseña" />
      <FormContainer>
        <h1>Actualizar Contraseña</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Actualizar e Iniciar Sesión
          </Button>
          {loadingResetPassword && <Loader />}
        </Form>
      </FormContainer>
    </>
  );
};

export default ResetPassword;
