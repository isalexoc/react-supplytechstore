import { Container, Row, Col } from "react-bootstrap";
import {
  FaHeadset,
  FaLock,
  FaSmile,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import Newsletter from "./Newsletter";

const Footer = () => {
  return (
    <>
      {/* Support Banner */}
      <div className="bg-black bg-opacity-10 py-4">
        <Container>
          <Row>
            <Col md={4} className="text-center">
              <FaHeadset size={40} className="text-primary mb-3" />
              <h5>Soporte permanente</h5>
              <p>
                Atentos para brindarte la mejor asesoría, contamos con personal
                especializado en todas nuestras líneas de productos.
              </p>
            </Col>

            <Col md={4} className="text-center">
              <FaLock size={40} className="text-primary mb-3" />
              <h5>Pagos seguros</h5>
              <p>
                Con medios de pago nacionales e internacionales para tu
                comodidad y tranquilidad.
              </p>
            </Col>

            <Col md={4} className="text-center">
              <FaSmile size={40} className="text-primary mb-3" />
              <h5>Dispuestos a atenderte</h5>
              <p>
                Para vivir la mejor experiencia de compra y satisfacción en cada
                pedido
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Footer */}
      <footer className="text-white bg-dark py-5">
        <Container>
          <Row className="mb-5">
            <Col md={4}>
              <h5 className="text-primary">
                <strong className="text-primary">Servicio al cliente</strong>
              </h5>
              <ul className="list-unstyled">
                <li>Lunes a Viernes de 7:30 am a 6:30 pm</li>
                <li>Sábados de 8:00 am a 4:00 pm</li>
                <li>+58 412-2763933</li>
                <li>+58 424-3189004</li>
                <li>supplytech.soldaduras@gmail.com</li>
                <li>R.I.F: J405080078, SUPPLY TECH C.A</li>
              </ul>
            </Col>

            <Col md={4}>
              <h3 className="text-primary mt-3 mt-md-0">
                <strong className="text-primary">Ubícanos Aquí</strong>
              </h3>
              <p>
                Av. Bolivar Oeste #150 C/C Av. Ayacucho, Edificio Don Antonio,
                Piso B, Local 2, Sector casco central de Maracay, Edo. Aragua,
                Zona postal 2101
              </p>
              <div className="d-flex mb-5 mt-4">
                <a
                  href="https://maps.app.goo.gl/ggoGpA6aXhvwSwP17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group d-flex flex-column justify-content-center align-items-center group-hover text-decoration-none me-5"
                >
                  <FaMapMarkerAlt
                    size={30}
                    className="text-primary me-3 mb-1"
                  />
                  Ir al mapa
                </a>
                <a
                  href="tel:+584122763933"
                  className="group d-flex flex-column justify-content-center align-items-center group-hover text-decoration-none"
                >
                  <FaPhoneAlt size={30} className="text-primary mb-1" />
                  Llamar ahora
                </a>
              </div>
            </Col>

            <Col md={4}>
              <Newsletter />
            </Col>
          </Row>

          <hr />

          <Row className="text-center">
            <Col md={6}>
              <p>
                Brindamos a nuestros clientes el mejor{" "}
                <strong className="text-primary">servicio</strong>, variedad,
                <strong className="text-primary">calidad</strong> y{" "}
                <strong className="text-primary">valor</strong> de productos.
              </p>
              <p>
                © 2023 Supplytechstore - tienda en linea. Todos los derechos
                reservados
              </p>
            </Col>

            <Col md={6}>
              <h5 className="text-primary">
                <strong className="text-primary">Conéctate con nosotros</strong>
              </h5>
              <div className="d-flex gap-3 justify-content-center">
                <a href="https://www.facebook.com/profile.php?id=100054573574236">
                  <FaFacebook size={40} className="text-white" />
                </a>
                <a href="https://www.instagram.com/supply_tech/">
                  <FaInstagram size={40} className="text-white" />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
