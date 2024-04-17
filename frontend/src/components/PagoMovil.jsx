import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { GiCardExchange } from "react-icons/gi";
import { Link } from "react-router-dom";

const PagoMovil = ({ order, isAdmin, isCard }) => {
  return (
    <>
      <ListGroup.Item className="d-flex justify-content-center align-items-center">
        <span className="h3 mb-0 ms-2">
          {isCard ? "Pago con tarjeta" : "Pago Movil"}
        </span>
      </ListGroup.Item>

      {!isAdmin && !order.isPaid && (
        <ListGroup.Item className="d-flex flex-column justify-content-center align-items-center">
          <h5>
            Pague directamente a través de Pago Móvil con el siguiente botón:
          </h5>

          <Button className="btn-light">
            <img src="/images/pagomovil.png" alt="pagomovil" />
          </Button>

          <Link
            className="mt-3 text-decoration-none"
            to={`/changepay/${order._id}`}
          >
            <GiCardExchange /> Cambiar el tipo de pago
          </Link>
        </ListGroup.Item>
      )}
    </>
  );
};

export default PagoMovil;
