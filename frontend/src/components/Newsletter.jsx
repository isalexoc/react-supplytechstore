import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useSubscribeNewsletterMutation,
  useUnsubscribeNewsletterMutation,
} from "../slices/usersApiSlice";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { Button, Card } from "react-bootstrap";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const [subscribeNewsletter, { isLoading, error }] =
    useSubscribeNewsletterMutation();

  const [
    unsubscribeNewsletter,
    { isLoading: loadingUnsubscribe, error: errorUnsubscribe },
  ] = useUnsubscribeNewsletterMutation();

  useEffect(() => {
    const checkSubscription = async () => {
      if (userInfo && userInfo.email) {
        try {
          const response = await fetch(
            `/api/users/subscribe?email=${encodeURIComponent(userInfo.email)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (data.isSubscribed) {
            setIsSubscribed(true);
          } else {
            setEmail(userInfo.email);
            setIsSubscribed(false);
          }
        } catch (error) {
          console.error(
            "Error checking newsletter subscription status:",
            error
          );
          toast.error("Error checking the newsletter subscription status.");
        }
      } else {
        setIsSubscribed(false);
      }
    };

    checkSubscription();
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Por favor ingresa un email valido.");
      return;
    }

    const userName = userInfo ? userInfo?.name : "No registrado";

    try {
      await subscribeNewsletter({ email, userName }).unwrap();
      toast("¡Gracias por suscribirte a nuestros boletines. Chequea tu email!");
      setIsSubscribed(true);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleUnsubscribe = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres darte de baja de nuestros boletines?"
      )
    ) {
      try {
        await unsubscribeNewsletter({ email: userInfo.email }).unwrap();
        toast("Te has dado de baja de nuestros boletines.");
        setIsSubscribed(false);
        setEmail(userInfo.email);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (error) {
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );
  }

  if (isSubscribed) {
    if (errorUnsubscribe) {
      return (
        <Message variant="danger">
          {errorUnsubscribe?.data?.message || errorUnsubscribe.error}
        </Message>
      );
    } else if (loadingUnsubscribe) {
      return <Loader />;
    } else {
      return (
        <Card className="text-center bg-dark">
          <Card.Body>
            <Card.Title className="mb-3">Boletín Informativo</Card.Title>
            <Card.Text>
              Ya estás subscrito a nuestros boletines con el correo:
              <span className="form-control">{userInfo?.email}</span> Siempre
              puedes darte de baja si cambias de opinión.
            </Card.Text>
            <Button variant="primary" onClick={handleUnsubscribe}>
              Darse de baja
            </Button>
          </Card.Body>
        </Card>
      );
    }
  } else {
    return (
      <div>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column align-items-start"
        >
          <h5 className="text-primary mb-3 mt-3 mt-md-0">
            <strong className="text-primary">
              Regístrate en nuestros boletines
            </strong>
          </h5>
          <div className="d-flex">
            <input
              type="email"
              className="form-control"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary ms-2">
              Subscribirse
            </button>
            {isLoading && <Loader />}
          </div>
        </form>
      </div>
    );
  }
};

export default Newsletter;
