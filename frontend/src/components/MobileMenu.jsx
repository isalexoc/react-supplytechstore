import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import WhatsAppButton from "./WhatsAppButton";
import { GrCatalog, GrContact } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
const MobileMenu = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <WhatsAppButton isMobile={isMobile} />
      <div className={isMobile ? "d-block" : "d-none"}>
        <Navbar
          bg="light"
          color="white"
          variant="black"
          expand="lg"
          expanded={false}
          collapseOnSelect
          className={`fixed-mobile-nav py-2`}
        >
          <Container>
            <LinkContainer
              to="/products/todos%20los%20productos/page/1"
              className="me-0"
              activeClassName="active-nav-link"
            >
              <Nav.Link className="d-flex flex-column justify-content-center align-items-center">
                <GrCatalog size={20} />
                <span className="mobile-font">Catálogo</span>
              </Nav.Link>
            </LinkContainer>

            <LinkContainer
              to="/contact"
              className="me-0"
              activeClassName="active-nav-link"
            >
              <Nav.Link className="d-flex flex-column justify-content-center align-items-center">
                <GrContact size={20} />
                <span className="mobile-font">Contacto</span>
              </Nav.Link>
            </LinkContainer>

            <LinkContainer
              to="/profile"
              className="me-0"
              activeClassName="active-nav-link"
            >
              <Nav.Link className="d-flex flex-column justify-content-center align-items-center">
                <FaRegUser size={20} />
                <span className="mobile-font">Mi Cuenta</span>
              </Nav.Link>
            </LinkContainer>
          </Container>
        </Navbar>
      </div>
    </>
  );
};

export default MobileMenu;
