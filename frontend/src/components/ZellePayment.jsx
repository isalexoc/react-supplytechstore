import { useState } from "react";
import {
  useUploadPaymentCaptureMutation,
  useUpdateOrderZelleMutation,
} from "../slices/orderApiSlice";
import { Button, Form, ListGroup } from "react-bootstrap";
import { FaArrowDown, FaWhatsapp } from "react-icons/fa";
import { GiCardExchange } from "react-icons/gi";
import { SiZelle } from "react-icons/si";
import { Link } from "react-router-dom";
import Message from "./Message";
import { toast } from "react-toastify";
import Loader from "./Loader";

const ZellePayment = ({ order, refetch, isAdmin }) => {
  const [zelleReference, setZelleReference] = useState("");
  const [imagen, setImagen] = useState("");

  const [
    uploadPaymentCapture,
    { isLoading: loadingUpload, error: errorUpload },
  ] = useUploadPaymentCaptureMutation();

  const [updateOrder, { isLoading: loadingSubmit, error: errorSubmit }] =
    useUpdateOrderZelleMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (zelleReference === "" && imagen === "") {
      toast.error(
        "Por favor ingrese el número de referencia o suba el capture de la transferencia."
      );
      return;
    }

    let zelleInfo = {};

    if (zelleReference !== "" && imagen === "") {
      if (
        window.confirm(
          `¿Estás seguro de enviar el número de referencia de ZELLE: ${zelleReference}?`
        )
      ) {
        zelleInfo = {
          referenceType: "ReferenceNumber",
          code: zelleReference,
        };
      }
    } else if (zelleReference === "" && imagen !== "") {
      zelleInfo = {
        referenceType: "ReferenceImage",
        image: imagen,
      };
    } else if (zelleReference !== "" && imagen !== "") {
      zelleInfo = {
        referenceType: "both",
        image: imagen,
        code: zelleReference,
      };
    } else {
      toast.error("Error al enviar la información de Zelle");
      return;
    }

    try {
      await updateOrder({
        orderId: order._id,
        referenceType: zelleInfo.referenceType,
        code: zelleInfo.code || "",
        image: zelleInfo.image || "",
      }).unwrap();
      toast.success(
        "Número de referencia enviado con éxito. Espere confirmación del pago. Gracias!. Puede contactar por whatsapp para mayor información."
      );
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
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

  const deleteConfimation = async () => {
    console.log("delete");
    try {
      await updateOrder({
        orderId: order._id,
        referenceType: "delete",
      }).unwrap();
      setImagen("");
      setZelleReference("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return errorUpload ? (
    <Message variant="danger">
      {errorUpload?.data?.message || errorUpload.error}
    </Message>
  ) : errorSubmit ? (
    <Message variant="danger">
      {errorSubmit?.data?.message || errorSubmit.error}
    </Message>
  ) : order?.paymentConfirmation?.referenceType === "ReferenceImage" ||
    order?.paymentConfirmation?.referenceType === "ReferenceNumber" ||
    order?.paymentConfirmation?.referenceType === "both" ? (
    <>
      <ListGroup.Item className="d-flex justify-content-center align-items-center">
        <SiZelle size={30} /> <span className="h3 mb-0">Zelle</span>
      </ListGroup.Item>
      <ListGroup.Item className="d-flex flex-column justify-content-center align-items-center">
        {!isAdmin && !order.isPaid && (
          <h5>
            Su comprobante de pago ha sido enviado. Espere confirmación del
            pago. Gracias!
          </h5>
        )}

        <h6>COMPROBANTE DE PAGO</h6>
        {order?.paymentConfirmation?.referenceType === "ReferenceNumber" && (
          <div>
            <h6>Número de referencia:</h6>
            <Form.Control
              type="text"
              value={order?.paymentConfirmation?.code}
              readOnly
              className="bg-light outline-none focus:outline-none focus:ring-0 border-none mb-3"
            />
          </div>
        )}
        {order?.paymentConfirmation?.referenceType === "ReferenceImage" && (
          <>
            <h6>Capture:</h6>
            <div className="d-flex justify-content-center p-2 bg-light mb-2">
              <img
                src={order?.paymentConfirmation?.image}
                width={200}
                height="auto"
                alt="Capture de la transferencia"
                className="img-fluid shadow-lg"
              />
            </div>
          </>
        )}
        {order?.paymentConfirmation?.referenceType === "both" && (
          <>
            <h6>Número de referencia: </h6>
            <Form.Control
              type="text"
              value={order?.paymentConfirmation?.code}
              readOnly
              className="bg-light outline-none focus:outline-none focus:ring-0 border-none mb-3"
            />
            <h6>Capture:</h6>
            <div className="d-flex justify-content-center p-2 bg-light mb-2">
              <img
                src={order?.paymentConfirmation?.image}
                width={200}
                height="auto"
                alt="Capture de la transferencia"
                className="img-fluid shadow-lg"
              />
            </div>
          </>
        )}
        {!isAdmin && !order.isPaid && (
          <>
            <Button
              className="btn btn-primary text-decoration-none"
              type="button"
              onClick={deleteConfimation}
            >
              Editar
            </Button>
            <Link
              className="mt-3 text-decoration-none"
              to={`/changepay/${order._id}`}
            >
              <GiCardExchange /> Cambiar el tipo de pago
            </Link>
          </>
        )}
      </ListGroup.Item>
    </>
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
            hidden
          ></Form.Control>
          <Form.Group controlId="zelleCapture">
            <Form.Control
              type="file"
              label="selecciona la imagen"
              name="zelleCapture"
              onChange={uploadFileHandler}
            />
          </Form.Group>
          {imagen && (
            <div className="d-flex justify-content-center p-3">
              <img
                src={imagen}
                width={200}
                height="auto"
                alt="Capture de la transferencia"
                className="img-fluid shadow-lg"
              />
            </div>
          )}
          <Button type="submit" className="btn-primary mt-3">
            Enviar
          </Button>
          {loadingUpload && <Loader />}
          {loadingSubmit && <Loader />}
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
