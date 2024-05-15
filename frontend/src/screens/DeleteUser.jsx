// src/pages/DeleteUser.js
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  useDeleteAccountMutation,
  useLogoutMutation,
} from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetCart } from "../slices/cartSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Message from "../components/Message";

const DeleteUser = () => {
  const [deleteAccount, { isLoading, error }] = useDeleteAccountMutation();
  const [logoutApiCall] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, rellena todos los campos");
      return;
    }

    try {
      const res = await deleteAccount({ email, password }).unwrap();
      logoutHandler();
      toast.success(res.message);
    } catch (error) {
      toast.error("Error al eliminar la cuenta");
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Eliminar Cuenta</h1>
      <p className="text-primary">
        Al enviar este formulario, estás solicitando la eliminación permanente
        de tu cuenta y todos los datos relacionados de nuestros sistemas. Una
        vez eliminada, esta acción no puede revertirse. Asegúrate de haber
        respaldado cualquier dato importante antes de proceder.
      </p>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLocaleLowerCase())}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          BORRAR CUENTA
        </Button>
        {error && (
          <Message variant="danger">
            {error?.data.message || error.error}
          </Message>
        )}
        {isLoading && <Loader />}
      </Form>
    </div>
  );
};

export default DeleteUser;
