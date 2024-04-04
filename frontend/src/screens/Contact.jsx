import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import ShowMap from "../components/ShowMap";
import { useContactFormMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [personName, setPersonName] = useState("");
  const [message, setMessage] = useState("");

  const [contactForm, { isLoading, error }] = useContactFormMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactForm({ email, personName, message }).unwrap();
      toast.success(
        "Muchas gracias por tu mensaje. Te responderemos a la brevedad!"
      );
      setEmail("");
      setPersonName("");
      setMessage("");
    } catch (error) {
      toast.error(
        "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo."
      );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container className="my-5">
      {error && (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      )}
      <Row className="justify-content-center">
        <h1 className="text-center mb-5">Contacta con nosotros</h1>
        <Col lg={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu nombre"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicMessage">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Escribe tu mensaje aquí"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Enviar
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mb-4">
            <a
              href="tel:+584122763933"
              className="d-flex justify-content-center align-items-center text-decoration-none"
            >
              <FaPhoneAlt size={22} className="text-primary mb-1 me-2" /> +58
              412-2763933 | +58 424-3189004
            </a>{" "}
            <a
              href="mailto:supplytech.soldaduras@gmail.com"
              className="d-flex justify-content-center align-items-center text-decoration-none mb-1"
            >
              <MdEmail size={25} className="text-primary me-2" />{" "}
              supplytech.soldaduras@gmail.com
            </a>{" "}
            <a
              href="mailto:supplytech.soldaduras@gmail.com"
              className="d-flex justify-content-center align-items-center text-decoration-none mb-1"
            >
              <FaMapMarkerAlt size={25} className="text-primary me-2" /> Av.
              Bolivar Oeste #150 C/C Av. Ayacucho, Edificio Don Antonio, Piso B,
              Local 2, Sector casco central de Maracay, Edo. Aragua, Zona postal
              2101
            </a>{" "}
            <Button
              variant="success"
              href="https://wa.me/584122763933?text=Hola%20quiero%20mas%20info%20sobre%20los%20productos"
              target="_blank"
              className="d-flex align-items-center justify-content-center mt-3"
            >
              <FaWhatsapp /> Contactar por WhatsApp
            </Button>
          </div>
        </Col>
        <Col lg={6}>
          <ShowMap />
          <div className="text-center">
            <p>O también puedes encontrarnos en nuestras redes sociales:</p>
            <div className="d-flex gap-3 justify-content-center">
              <a href="https://www.facebook.com/profile.php?id=100054573574236">
                <FaFacebook size={40} className="text-primary" />
              </a>
              <a href="https://www.instagram.com/supply_tech/">
                <FaInstagram size={40} className="text-primary" />
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
