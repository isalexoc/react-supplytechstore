import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import {
  useRegisterMutation,
  useGoogleLoginMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleGoogleSubmit = async (credentialResponse) => {
    try {
      const res = await googleLogin(credentialResponse).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      handleGoogleSubmit(credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <FormContainer>
      <h1>Registro nuevo cliente</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="mt-3"
          disabled={isLoading}
        >
          Registro
        </Button>

        {isLoading && <Loader />}
      </Form>

      <p className="mt-3">
        También te puedes registrar con tu cuenta de google
      </p>
      <div className="mt-3">
        <GoogleLogin
          language="es"
          onSuccess={(credentialResponse) => {
            handleGoogleSubmit(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
      {googleLoading && <Loader />}

      <Row className="py-3">
        <Col>
          ¿Ya tienes una cuenta?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Iniciar Sesión
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
