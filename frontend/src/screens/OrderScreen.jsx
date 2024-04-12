import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
//import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import ZellePayment from "../components/ZellePayment";
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../slices/orderApiSlice";
import { GiCardExchange } from "react-icons/gi";
import { GiCash } from "react-icons/gi";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import Meta from "../components/Meta";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    error,
    isLoading,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  //const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line
  }, []);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Orden entregada");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <Meta title={`Orden ${order._id}`} />
      <h5>Orden: {order._id}</h5>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Envío</h2>
              <p>
                <strong>Nombre: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Dirección: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Entregado el {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">No entregado</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Método de pago</h2>
              <p>
                <strong>Método: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Pagado el {order.paidAt}</Message>
              ) : (
                <Message variant="danger">No pagado</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Productos</h2>

              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col xs={6} sm={4} md={3} lg={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col xs={6} sm={4} md={6}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={3} sm={4} className="text-center">
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Envío</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Impuestos</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* PAY ORDER PLACEHOLDER */}
              {order.paymentMethod === "Zelle" && (
                <ZellePayment order={order} refetch={refetch} />
              )}

              {order.paymentMethod === "Efectivo" && (
                <>
                  <ListGroup.Item className="d-flex justify-content-center align-items-center">
                    <GiCash size={30} />{" "}
                    <span className="h3 mb-0">Efectivo</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex flex-column justify-content-center align-items-center">
                    <h5>
                      Dirígase a nuestra tienda para pagar en efectivo y retirar
                      productos
                    </h5>
                    <p>
                      Av. Bolivar Oeste #150 C/C Av. Ayacucho, Edificio Don
                      Antonio, Piso B, Local 2, Sector casco central de Maracay,
                      Edo. Aragua, Zona postal 2101
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
                      to={`/changepay/${order._id}`}
                    >
                      <GiCardExchange /> Cambiar el tipo de pago
                    </Link>
                  </ListGroup.Item>
                </>
              )}
              {order.paymentMethod === "PagoMovil" && (
                <>
                  <ListGroup.Item className="d-flex justify-content-center align-items-center">
                    <img src="/images/pagomovil.png" alt="pagomovil" />
                    <span className="h3 mb-0 ms-2">Pago Movil</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex flex-column justify-content-center align-items-center">
                    <h5>
                      Pague directamente a través de Pago Móvil con el siguiente
                      botón:
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
                </>
              )}
              {order.paymentMethod === "Transferencia" && (
                <p>Transferencia Bancaria</p>
              )}
              {order.paymentMethod === "Transferencia" && (
                <p>Transferencia Bancaria</p>
              )}
              {order.paymentMethod === "Tarjeta" && (
                <p>Tarjeta de Débito o Crédito</p>
              )}

              {/* MARK AS DELIVERED PLACEHOLDER */}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Marcar como entregada
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
