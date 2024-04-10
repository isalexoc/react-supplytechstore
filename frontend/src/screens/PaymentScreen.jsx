import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";
import { FaCcMastercard, FaCcVisa, FaCcDiscover } from "react-icons/fa";
import { FaCcAmex } from "react-icons/fa6";
import { MdCreditCard } from "react-icons/md";
import { BsBank2 } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import { IoCash } from "react-icons/io5";
import { GiCash } from "react-icons/gi";
import { SiZelle } from "react-icons/si";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("Transferencia");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const pagoMovilImage = "/images/pagomovil.png";

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  console.log(paymentMethod);

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Método de pago</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Selecciona método de pago</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="Zelle"
              id="Zelle"
              name="paymentMethod"
              value="Zelle"
              checked={paymentMethod === "Zelle"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <div className="ms-5">
              <SiZelle size={30} style={{ color: "#1384C8" }} />
            </div>
          </Col>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="Tarjeta de Débito o Crédito"
              id="Tarjeta"
              name="paymentMethod"
              checked={paymentMethod === "PayPal"}
              value="Tarjeta"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <div className="ms-5">
              <FaCcVisa size={30} style={{ color: "#1384C8" }} />{" "}
              <FaCcMastercard size={30} style={{ color: "#1384C8" }} />{" "}
              <FaCcDiscover size={30} style={{ color: "#1384C8" }} />{" "}
              <FaCcAmex size={30} style={{ color: "#1384C8" }} />{" "}
              <MdCreditCard size={30} style={{ color: "#1384C8" }} />
            </div>
          </Col>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="Pago Movil"
              id="PagoMovil"
              name="paymentMethod"
              checked={paymentMethod === "PagoMovil"}
              value="PagoMovil"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <img className="ms-5" src={pagoMovilImage} alt="PagoMovil" />
          </Col>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="Transferencia Bancaria"
              id="Transferencia"
              name="paymentMethod"
              checked={paymentMethod === "Transferencia"}
              value="Transferencia"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <div className="ms-5">
              <BiTransfer size={30} style={{ color: "#1384C8" }} />{" "}
              <BsBank2 size={30} style={{ color: "#1384C8" }} />{" "}
              <BiTransfer size={30} style={{ color: "#1384C8" }} />
            </div>
          </Col>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="Efectivo"
              id="Efectivo"
              checked={paymentMethod === "Efectivo"}
              name="paymentMethod"
              value="Efectivo"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <div className="ms-5">
              <IoCash size={30} style={{ color: "#1384C8" }} />{" "}
              <GiCash size={30} style={{ color: "#1384C8" }} />
            </div>
          </Col>
        </Form.Group>
        <Button className="mt-3" type="submit" variant="primary">
          Continuar
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
