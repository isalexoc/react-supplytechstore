import { GiCash } from "react-icons/gi";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { GiCardExchange } from "react-icons/gi";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const CashPayment = ({ orderId, isAdmin }) => {
  return (
    <>
      <ListGroup.Item className="d-flex justify-content-center align-items-center">
        <GiCash size={30} /> <span className="h3 mb-0">Efectivo</span>
      </ListGroup.Item>

      {!isAdmin && (
        <ListGroup.Item className="d-flex flex-column justify-content-center align-items-center">
          <h5>
            Dirígase a nuestra tienda para pagar en efectivo y retirar productos
          </h5>
          <p>
            Av. Bolivar Oeste #150 C/C Av. Ayacucho, Edificio Don Antonio, Piso
            B, Local 2, Sector casco central de Maracay, Edo. Aragua, Zona
            postal 2101
          </p>
          <div className="d-flex mt-2">
            <a
              href="https://maps.app.goo.gl/ggoGpA6aXhvwSwP17"
              target="_blank"
              rel="noopener noreferrer"
              className="group d-flex flex-column justify-content-center align-items-center group-hover text-decoration-none me-5 btn btn-light"
            >
              <FaMapMarkerAlt size={20} className="text-danger" />
              Ir al mapa
            </a>
            <a
              href="tel:+584122763933"
              className="group d-flex flex-column justify-content-center align-items-center group-hover text-decoration-none me-5 btn btn-light"
            >
              <FaPhoneAlt size={20} className="text-success mb-1" />
              Llamar ahora
            </a>
          </div>
          <Link
            className="mt-3 text-decoration-none"
            to={`/changepay/${orderId}`}
          >
            <GiCardExchange /> Cambiar el tipo de pago
          </Link>
        </ListGroup.Item>
      )}
    </>
  );
};

export default CashPayment;
