import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
//import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import ZellePayment from "../components/ZellePayment";
import CashPayment from "../components/CashPayment";
import TransferPayment from "../components/TransferPayment";
import PagoMovil from "../components/PagoMovil";
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
  useMarkAsPaidMutation,
  useGeneratePdfMutation,
} from "../slices/orderApiSlice";
import Meta from "../components/Meta";
import getDollarPrice from "../utils/dollarPrice";
import { ORDERS_URL } from "../constants";

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

  const [markAsPaid, { isLoading: loadingMarkAsPaid }] =
    useMarkAsPaidMutation();

  const [generatePdf, { isLoading: loadingGeneratePdf, error: PdfError }] =
    useGeneratePdfMutation();

  //const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { userInfo } = useSelector((state) => state.auth);

  const [dollar, setDollar] = useState(0);

  useEffect(() => {
    const fetchDollarPrice = async () => {
      const currentDollarPrice = await getDollarPrice();
      setDollar(currentDollarPrice);
    };

    fetchDollarPrice();
  }, []);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line
  }, []);

  const deliverOrderHandler = async () => {
    if (window.confirm("¿Estás seguro de marcar la orden como ENTREGADA?")) {
      try {
        await deliverOrder(orderId);
        refetch();
        toast.success("Orden entregada");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const markAsPaidHandler = async () => {
    if (window.confirm("¿Estás seguro de marcar la orden como PAGADA?")) {
      try {
        await markAsPaid(orderId);
        refetch();
        toast.success("Orden marcada como pagada");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handlePdf = async () => {
    try {
      await generatePdf(orderId);
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
                <>
                  <Message variant="success">Pagado el {order.paidAt}</Message>
                  <a
                    href={`${ORDERS_URL}/${orderId}/pdf`}
                    download
                    className="bg-secondary text-white p-2 rounded text-decoration-none"
                  >
                    Descargar Factura
                  </a>
                  <Button onClick={handlePdf}>Descargar Factura</Button>
                  {loadingGeneratePdf && <Loader />}
                  {PdfError && (
                    <Message variant="danger">
                      {PdfError?.data?.message}
                    </Message>
                  )}
                </>
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
              {/* <ListGroup.Item>
                <Row>
                  <Col>Impuestos</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item> */}{" "}
              {/* Benjamín no necesita taxes */}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    <div>${order.totalPrice}</div>
                    <div>
                      {dollar > 0
                        ? `Bs. ${(order.totalPrice * dollar).toFixed(2)}`
                        : ""}
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
              {/* PAY ORDER PLACEHOLDER */}
              {order.paymentMethod === "Zelle" && (
                <ZellePayment
                  order={order}
                  refetch={refetch}
                  isAdmin={userInfo?.isAdmin}
                />
              )}
              {order.paymentMethod === "Efectivo" && (
                <CashPayment order={order} isAdmin={userInfo?.isAdmin} />
              )}
              {order.paymentMethod === "PagoMovil" && (
                <PagoMovil
                  order={order}
                  isAdmin={userInfo?.isAdmin}
                  isCard={false}
                />
              )}
              {order.paymentMethod === "Transferencia" && (
                <TransferPayment
                  order={order}
                  refetch={refetch}
                  isAdmin={userInfo?.isAdmin}
                />
              )}
              {order.paymentMethod === "Tarjeta" && (
                <PagoMovil
                  order={order}
                  isAdmin={userInfo?.isAdmin}
                  isCard={true}
                />
              )}
              {/* MARK AS DELIVERED PLACEHOLDER */}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo?.isAdmin &&
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
              {/* MARK AS PAID */}
              {userInfo && userInfo?.isAdmin && !order.isPaid && (
                <ListGroup.Item className="text-center">
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={markAsPaidHandler}
                  >
                    Marcar como pagada
                  </Button>
                  {loadingMarkAsPaid && <Loader />}
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
