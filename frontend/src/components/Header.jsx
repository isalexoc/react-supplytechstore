import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
import { MdOutlineContactSupport } from "react-icons/md";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import SearchBox from "./SearchBox";
import { resetCart } from "../slices/cartSlice";
import logo from "../assets/logo.png";
import { truncateString } from "../utils/textUtils";
import BannerVideo from "./BannerVideo";
import { useLocation } from "react-router-dom";
import { checkIFstandAlone } from "../utils/checkIfStandAlone";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const [navbarBg, setNavbarBg] = useState("dark");
  const [isHome, setIsHome] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isStandAlone = checkIFstandAlone();
  const isMobile = window.innerWidth <= 989;

  useEffect(() => {
    setExpanded(false);
    window.scrollTo(0, 0);
    const handleScroll = () => {
      // Set navbar background color based on scroll position and current path
      if (
        (currentPath === "/" || currentPath.startsWith("/page/1")) &&
        window.scrollY > 50 &&
        !isStandAlone
      ) {
        setNavbarBg("dark");
        setIsScrolled(true);
      } else {
        setNavbarBg("transparent");
        setIsScrolled(false);
      }
    };

    if (
      (currentPath === "/" || currentPath.startsWith("/page/1")) &&
      !isStandAlone
    ) {
      setNavbarBg("transparent");
      setIsHome(true);
      // Add scroll event listener
      if (!isStandAlone) {
        window.addEventListener("scroll", handleScroll);
      }
    } else {
      setNavbarBg("dark");
      setIsHome(false);
    }

    // Clean up the event listener when the component unmounts or path changes
    return () => {
      if (!isStandAlone) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentPath, isStandAlone]);

  useEffect(() => {
    if (isStandAlone) {
      // If the app is standalone, always set the navbar background to dark
      setNavbarBg("dark");
    }
  }, [isStandAlone]);

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
    <>
      <header>
        <Navbar
          bg={navbarBg}
          color="white"
          variant="dark"
          expand="lg"
          expanded={expanded}
          collapseOnSelect
          onToggle={(expanded) => {
            setExpanded(expanded);
            if (expanded) {
              setNavbarBg("dark");
            } else if (!isScrolled && isHome && !isStandAlone) {
              setNavbarBg("transparent");
            }
          }}
          className={`${
            isHome && isScrolled && "border-bottom"
          } fixed-header py-2`}
        >
          <Container>
            <LinkContainer to="/" className="me-0">
              <Navbar.Brand>
                <img src={logo} width={40} alt="logo" />
                SupplyTechStore
              </Navbar.Brand>
            </LinkContainer>
            <LinkContainer to="/cart" className="d-lg-none">
              <Nav.Link className="">
                <div>
                  <FaShoppingCart size={20} color="white" />
                  {cartItems?.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
                </div>
              </Nav.Link>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto mt-3 mt-lg-0">
                <SearchBox onSearch={() => setExpanded(false)} />
                <LinkContainer to="/cart">
                  <Nav.Link className="d-flex flex-lg-column justify-content-center align-items-start align-items-lg-center mt-3 mb-2 my-lg-0">
                    <div>
                      <FaShoppingCart size={25} />
                      {cartItems?.length > 0 && (
                        <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                          {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                        </Badge>
                      )}
                    </div>
                    <span className="ms-2">Carrito</span>
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/products/todos%20los%20productos/page/1">
                  <Nav.Link className="d-flex flex-lg-column justify-content-center align-items-start align-items-lg-center my-2 my-lg-0">
                    <GrCatalog size={25} />
                    <span className="ms-2">Catálogo</span>
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/contact">
                  <Nav.Link className="d-flex flex-lg-column justify-content-center align-items-start align-items-lg-center my-2 my-lg-0">
                    <MdOutlineContactSupport size={25} />
                    <span className="ms-2">Contacto</span>
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <NavDropdown
                    title={
                      <div className="d-inline text-center my-2 my-lg-0">
                        {truncateString(userInfo.name, 7)}
                      </div>
                    }
                    id="username"
                    className="text-center d-lg-flex align-items-center"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Mi Perfil</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Salir
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link className="d-flex flex-lg-column justify-content-center align-items-center align-items-lg-center my-2 my-lg-0">
                      <FaUser /> <span className="ms-2">Iniciar Sesión</span>
                    </Nav.Link>
                  </LinkContainer>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown
                    title="Admin"
                    id="adminmenu"
                    className="text-center d-lg-flex align-items-center my-2 my-lg-0"
                  >
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Usuarios</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Productos</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Órdenes</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
                {isStandAlone && expanded && isMobile && (
                  <>
                    <h5 className="text-center text-white mt-4 mb-1">
                      Nuestras Redes
                    </h5>

                    <div className="d-flex gap-3 justify-content-center mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.facebook.com/profile.php?id=100054573574236"
                      >
                        <FaFacebook size={40} className="text-white" />
                      </a>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.instagram.com/supply_tech/"
                      >
                        <FaInstagram size={40} className="text-white" />
                      </a>
                    </div>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      {(currentPath === "/" || currentPath.startsWith("/page/1")) && (
        <BannerVideo />
      )}
    </>
  );
};

export default Header;
