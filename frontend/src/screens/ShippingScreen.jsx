import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress, saveShippingMethod } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import Meta from "../components/Meta";
import { toast } from "react-toastify";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, shippingMethod } = cart;

  const [shippingMethod2, setShippingMethod2] = useState(shippingMethod); // add a new state for shippingMethod
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [estado, setEstado] = useState(shippingAddress?.estado || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(
    shippingAddress?.country || "Venezuela"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    setCountry("Venezuela");

    if (shippingMethod2 === "pickup") {
      navigate("/payment");
      return;
    } else if (shippingMethod2 === "address") {
      if (!address || !city || !postalCode || !country || !estado) {
        toast.error("Por favor, completa todos los campos de la dirección");
      } else {
        dispatch(
          saveShippingAddress({ address, estado, city, postalCode, country })
        );
        navigate("/payment");
      }
    }
  };

  return (
    <>
      <Meta title="Opciones de envío" />
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Opciones de envío</h1>

        <Form onSubmit={submitHandler}>
          {/* add a radio button to select "retiro en tienda" */}
          <Form.Group controlId="pickup" className="my-2">
            <Form.Check
              type="radio"
              label="Retiro en tienda"
              id="pickup"
              value="pickup"
              checked={shippingMethod2 === "pickup"}
              className="mb-2"
              onChange={(e) => {
                dispatch(saveShippingMethod("pickup"));
                setShippingMethod2(e.target.value);
              }}
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Envío a domicilio"
              id="direccion"
              checked={shippingMethod2 === "address"}
              value="address"
              onChange={(e) => {
                dispatch(saveShippingMethod("address"));
                setShippingMethod2(e.target.value);
              }}
            ></Form.Check>
          </Form.Group>

          {shippingMethod === "address" && (
            <>
              <Form.Group className="my-2">
                <Form.Label>Estado: </Form.Label>
                <Form.Control
                  type="text"
                  id="autocomplete"
                  placeholder="Ingresa tu estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2" controlId="city">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2" controlId="postalCode">
                <Form.Label>Código postal</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu código postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="address" className="my-2">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="country">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu país"
                  value="Venezuela"
                  readOnly
                ></Form.Control>
              </Form.Group>
            </>
          )}

          <Button type="submit" variant="primary" className="my-2">
            Continuar
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
