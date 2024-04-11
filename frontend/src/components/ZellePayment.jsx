import { useState } from "react";
import { useUploadPaymentCaptureMutation } from "../slices/orderApiSlice";
import { Button, Form, ListGroup } from "react-bootstrap";
import { FaArrowDown, FaWhatsapp } from "react-icons/fa";
import { GiCardExchange } from "react-icons/gi";
import { SiZelle } from "react-icons/si";
import { Link } from "react-router-dom";
import Message from "./Message";
import { toast } from "react-toastify";
import Loader from "./Loader";

const ZellePayment = ({ order }) => {
  const [zelleReference, setZelleReference] = useState("");
  const [imagen, setImagen] = useState("");

  const [
    uploadPaymentCapture,
    { isLoading: loadingUpload, error: errorUpload },
  ] = useUploadPaymentCaptureMutation();

  const submitHandler = (e) => {
    e.preventDefault();
    if (zelleReference === "" && imagen === "") {
      toast.error(
        "Por favor ingrese el número de referencia o suba el capture de la transferencia."
      );
      return;
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadPaymentCapture(formData).unwrap();
      setImagen(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return errorUpload ? (
    <Message variant="danger">
      {errorUpload?.data?.message || errorUpload.error}
    </Message>
  ) : (
    <>
      <ListGroup.Item className="d-flex justify-content-center align-items-center">
        <SiZelle size={30} /> <span className="h3 mb-0">Zelle</span>
      </ListGroup.Item>
      <ListGroup.Item className="d-flex flex-column justify-content-center align-items-center">
        <h5>
          Para pagar por zelle contacte por whatsapp para recibir los datos de
          transferencia a través del siguiente botón:
        </h5>
        <a
          href={`https://wa.me/584241234567?text=Hola,%20quiero%20pagar%20mi%20orden%20con%20*Zelle*%20.%20Esta%20es%20mi%20orden:%20https://www.supplytechstore.com/order/${order._id}%20.%20Mi%20nombre%20es:%20${order.user.name}%20.%20Mi%20correo%20es:%20${order.user.email}.%20Gracias!`}
          target="_blank"
          className="whatsapp-link2"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={50} />{" "}
          <span className="h5 mb-0">Pagar con Zelle</span>
        </a>

        <h5 className="mt-3">
          Una vez realizado el pago, ingrese el número de referencia o capture
          la pantalla de la transferencia
        </h5>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="zelleReference">
            <Form.Label>Número de referencia</Form.Label>
            <Form.Control
              type="text"
              value={zelleReference}
              onChange={(e) => setZelleReference(e.target.value)}
              placeholder="Número de referencia"
            />
          </Form.Group>
          <div className="mt-3">
            <Message variant="info">
              Si tiene el capture de la transferencia, súbalo aquí:{" "}
              <FaArrowDown />
            </Message>
          </div>

          <Form.Label className="mt-1">Imagen</Form.Label>
          <Form.Control
            type="text"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            placeholder="Imagen"
          ></Form.Control>
          <Form.Group controlId="zelleCapture">
            <Form.Control
              type="file"
              label="selecciona la imagen"
              name="zelleCapture"
              onChange={uploadFileHandler}
            />
          </Form.Group>
          <Button type="submit" className="btn-primary mt-3">
            Enviar
          </Button>
          {loadingUpload && <Loader />}
        </Form>

        <Link
          className="mt-3 text-decoration-none"
          to={`/changepay/${order._id}`}
        >
          <GiCardExchange /> Cambiar el tipo de pago
        </Link>
      </ListGroup.Item>
    </>
  );
};

export default ZellePayment;
