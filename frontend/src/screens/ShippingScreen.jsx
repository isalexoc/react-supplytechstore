import { useState, useEffect } from "react";
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
  const { shippingAddress } = cart;

  const [shippingMethod, setShippingMethod] = useState("address"); // add a new state for shippingMethod
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [estado, setEstado] = useState(shippingAddress?.estado || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if (shippingMethod === "pickup") {
      navigate("/payment");
      return;
    } else if (shippingMethod === "address") {
      if (!address || !city || !postalCode || !country) {
        toast.error("Por favor, completa todos los campos de la dirección");
      } else {
        dispatch(
          saveShippingAddress({ address, estado, city, postalCode, country })
        );
        navigate("/payment");
      }
    }
  };

  useEffect(() => {
    const initAutocomplete = async () => {
      // Wait for Google Maps API to load
      const googleMapsApi = await new Promise((resolve) => {
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve(window.google.maps);
        } else {
          // Handle cases where Google Maps API is not loaded yet
          console.error("Google Maps API not loaded");
        }
      });

      const autocomplete = new googleMapsApi.places.Autocomplete(
        document.getElementById("autocomplete"),
        {
          types: ["address"],
          componentRestrictions: { country: "ve" },
          fields: ["address_components", "geometry.location"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        try {
          const place = autocomplete.getPlace();

          if (!place || !place.address_components) return;

          // Extract address components
          const addressComponents = place.address_components;
          let estado = "";
          let city = "";
          let postalCode = "";
          let country = "";

          for (const component of addressComponents) {
            switch (component.types[0]) {
              case "street_number":
                estado += component.long_name + " ";
                break;
              case "route":
                estado += component.long_name + " ";
                setEstado(estado);
                break;
              case "locality": // city
                city = component.long_name;
                setCity(city);
                break;
              case "postal_code":
                postalCode = component.long_name;
                setPostalCode(postalCode);
                break;
              case "country":
                country = component.long_name;
                setCountry(country);
                break;
              default:
                break;
            }
          }
          // ... rest of your code to process address components
        } catch (error) {
          console.error("Error processing address components:", error);
        }
      });
    };

    initAutocomplete();
  }, []);

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
              checked={shippingMethod === "pickup"}
              className="mb-2"
              onChange={(e) => {
                dispatch(saveShippingMethod("pickup"));
                setShippingMethod(e.target.value);
              }}
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Envío a domicilio"
              id="direccion"
              checked={shippingMethod === "address"}
              value="address"
              onChange={(e) => {
                dispatch(saveShippingMethod("address"));
                setShippingMethod(e.target.value);
              }}
            ></Form.Check>
          </Form.Group>

          {shippingMethod === "address" && (
            <>
              <Form.Group controlId="address" className="my-2">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>
              </Form.Group>

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

              <Form.Group controlId="city">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="postalCode">
                <Form.Label>Código postal</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu código postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="country">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu país"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
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
