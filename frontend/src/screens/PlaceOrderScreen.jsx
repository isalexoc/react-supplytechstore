import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useCreateOrderMutation } from "../slices/orderApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import Meta from "../components/Meta";
import getDollarPrice from "../utils/dollarPrice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const [dollar, setDollar] = useState(0);

  useEffect(() => {
    const fetchDollarPrice = async () => {
      const currentDollarPrice = await getDollarPrice();
      setDollar(currentDollarPrice);
    };

    fetchDollarPrice();
  }, []);

  useEffect(() => {
    if (cart.shippingMethod === "address" && !cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingMethod, cart.shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        shippingMethod: cart.shippingMethod,
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error("Error al realizar el pedido");
    }
  };

  return (
    <>
      <Meta title="Realizar Pedido" />
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {cart.shippingMethod === "address" && (
              <ListGroup.Item>
                <h2>Envío a domicilio</h2>
                <p>
                  <strong>Dirección: </strong>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                  Edo. {cart.shippingAddress.estado},{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>
            )}

            {cart.shippingMethod === "pickup" && (
              <ListGroup.Item>
                <h2>Retiro en tienda</h2>
                <p>
                  Av. Bolivar Oeste #150 C/C Av. Ayacucho, Edificio Don Antonio,
                  Piso B, Local 2, Sector casco central de Maracay, Edo. Aragua,
                  Zona postal 2101
                </p>
              </ListGroup.Item>
            )}

            <ListGroup.Item>
              <h2>Método de pago</h2>
              <strong>Método: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Productos</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Su carrito está vacío</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col xs={6} sm={4} md={3}>
                          <Image
                            src={
                              item?.images[0] ? item?.images[0].url : item.image
                            }
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col xs={6} sm={4} md={5}>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4} sm={4} className="text-center">
                          {item.qty} x {(item.price * dollar).toFixed(2)} ={" "}
                          {(item.qty * (item.price * dollar)).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Resumen de la orden</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Productos</Col>
                  <Col>
                    {" "}
                    {dollar > 0
                      ? `Bs. ${(cart.totalPrice * dollar).toFixed(2)}`
                      : ""}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Envío</Col>
                  <Col>Bs. {(cart.shippingPrice * dollar).toFixed(2)}</Col>
                  {cart.shippingMethod === "address" &&
                    cart.shippingAddress?.city?.toLowerCase() === "maracay" && (
                      <p>
                        (item.price * dollar * 2).toFixed(2) de costo de envío
                        para Maracay Edo. Aragua (solo casco central de Maracay
                      </p>
                    )}
                </Row>
              </ListGroup.Item>
              {/* <ListGroup.Item>
                <Row>
                  <Col>Impuestos</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item> */}{" "}
              {/* Benjamín no necesita impuestos para la app */}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    {/*  <div>${cart.totalPrice}</div> */}
                    <div>
                      {dollar > 0
                        ? `Bs. ${(cart.totalPrice * dollar).toFixed(2)}`
                        : ""}
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant="danger">{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Realizar pedido
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
