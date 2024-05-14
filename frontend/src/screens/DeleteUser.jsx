import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const DeleteUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Assuming you have an API endpoint that handles account deletion requests
    const response = await fetch("/api/delete-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setFeedback(
        "Your request has been submitted. We will process it shortly. You will receive a confirmation email once your account and all associated data have been permanently deleted."
      );
    } else {
      setFeedback(
        "There was an error processing your request. Please try again."
      );
    }
  };

  return (
    <div className="">
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
        <div className="text-end my-1">
          <Link to="/forgotpassword" className="btn btn-link">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Button type="submit" variant="primary" className="mt-3">
          Iniciar Sesión
        </Button>
      </Form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default DeleteUser;
