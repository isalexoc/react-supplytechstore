import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import BackTo from "../components/BackTo";
import Meta from "../components/Meta";
import getDollarPrice from "../utils/dollarPrice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHnadler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const [dollar, setDollar] = useState(0);

  useEffect(() => {
    const fetchDollarPrice = async () => {
      const currentDollarPrice = await getDollarPrice();
      setDollar(currentDollarPrice);
    };

    fetchDollarPrice();
  }, []);

  return (
    <>
      <Meta title="Carrito de Compras" />
      <Row className="mb-5">
        <Col md={8}>
          <h1 style={{ marginBottom: "20px" }}>Carrito de Compras</h1>
          {cartItems.length === 0 ? (
            <Message>
              Tu carrito está vacío <Link to="/">Regresar</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col
                      xs={4}
                      sm={2}
                      md={2}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col
                      xs={8}
                      sm={10}
                      md={3}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col
                      xs={4}
                      sm={1}
                      md={2}
                      className="d-flex justify-content-center align-items-center mt-2 mt-sm-0"
                    >
                      ${item.price}
                    </Col>
                    <Col
                      xs={4}
                      sm={9}
                      md={4}
                      className="d-flex flex-column justify-content-center align-items-start mt-2 mt-sm-0"
                    >
                      Cantidad:
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHnadler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col
                      xs={4}
                      sm={2}
                      md={1}
                      className="d-flex justify-content-center align-items-center mt-2 mt-sm-0"
                    >
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  ) Artículos
                </h2>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
                {dollar > 0 && (
                  <h6 className="mb-0">
                    Bs.{" "}
                    {(
                      cartItems.reduce(
                        (acc, item) => acc + item.qty * item.price,
                        0
                      ) * dollar
                    ).toFixed(2)}
                  </h6>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceder al Pago
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <BackTo />
    </>
  );
};

export default CartScreen;
