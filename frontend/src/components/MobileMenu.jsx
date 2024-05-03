import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import WhatsAppButton from "./WhatsAppButton";
import { GrCatalog, GrContact } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { RxBorderStyle } from "react-icons/rx";

const MobileMenu = () => {
  const { userInfo } = useSelector((state) => state.auth);

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
      {!userInfo ? (
        <WhatsAppButton isMobile={isMobile} />
      ) : !userInfo.isAdmin ? (
        <WhatsAppButton isMobile={isMobile} />
      ) : (
        ""
      )}

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

            {userInfo && userInfo.isAdmin ? (
              <>
                <LinkContainer
                  to="/profile"
                  className="me-0"
                  activeClassName="active-nav-link"
                >
                  <Nav.Link className="d-flex flex-column justify-content-center align-items-center">
                    <MdOutlineAdminPanelSettings size={20} />
                    <span className="mobile-font">Perfil</span>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer
                  to="/admin/productlist"
                  className="me-0"
                  activeClassName="active-nav-link"
                >
                  <Nav.Link className="d-flex flex-column justify-content-center align-items-center">
                    <HiOutlineViewGridAdd size={20} />
                    <span className="mobile-font">Productos</span>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer
                  to="/admin/orderlist"
                  className="me-0"
                  activeClassName="active-nav-link"
                >
                  <Nav.Link className="d-flex flex-column justify-content-center align-items-center">
                    <RxBorderStyle size={20} />
                    <span className="mobile-font">Órdenes</span>
                  </Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <>
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
              </>
            )}
          </Container>
        </Navbar>
      </div>
    </>
  );
};

export default MobileMenu;
