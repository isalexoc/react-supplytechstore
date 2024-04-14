import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useUploadPaymentCaptureMutation,
  useUpdateOrderZelleMutation,
} from "../slices/orderApiSlice";
import { Button, Form, ListGroup } from "react-bootstrap";
import { FaArrowDown } from "react-icons/fa";
import { GiCardExchange } from "react-icons/gi";
import Message from "./Message";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { BiTransfer } from "react-icons/bi";
import { BsBank2 } from "react-icons/bs";

const TransferPayment = ({ order, refetch, isAdmin }) => {
  const [paymentReference, setPaymentReference] = useState("");
  const [imagen, setImagen] = useState("");

  const [
    uploadPaymentCapture,
    { isLoading: loadingUpload, error: errorUpload },
  ] = useUploadPaymentCaptureMutation();

  const [updateOrder, { isLoading: loadingSubmit, error: errorSubmit }] =
    useUpdateOrderZelleMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (paymentReference === "" && imagen === "") {
      toast.error(
        "Por favor ingrese el número de referencia o suba el capture de la transferencia."
      );
      return;
    }

    let zelleInfo = {};

    if (paymentReference !== "" && imagen === "") {
      if (
        window.confirm(
          `¿Estás seguro de enviar el número de transferencia: ${paymentReference}?`
        )
      ) {
        zelleInfo = {
          referenceType: "ReferenceNumber",
          code: paymentReference,
        };
      }
    } else if (paymentReference === "" && imagen !== "") {
      zelleInfo = {
        referenceType: "ReferenceImage",
        image: imagen,
      };
    } else if (paymentReference !== "" && imagen !== "") {
      zelleInfo = {
        referenceType: "both",
        image: imagen,
        code: paymentReference,
      };
    } else {
      toast.error("Error al enviar la información de Transferencia");
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
      setPaymentReference("");
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
        <div>
          <BiTransfer size={30} style={{ color: "#1384C8" }} />{" "}
          <BsBank2 size={30} style={{ color: "#1384C8" }} />{" "}
          <BiTransfer size={30} style={{ color: "#1384C8" }} />
        </div>{" "}
        <span className="h3 mb-0">Tranferencia</span>
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
              onClick={() => {
                setPaymentReference("");
                setImagen("");
                deleteConfimation();
              }}
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
        <div>
          <BiTransfer size={30} style={{ color: "#1384C8" }} />{" "}
          <BsBank2 size={30} style={{ color: "#1384C8" }} />{" "}
          <BiTransfer size={30} style={{ color: "#1384C8" }} />
        </div>{" "}
        <span className="h3 mb-0">Transferencia</span>
      </ListGroup.Item>
      <ListGroup.Item className="d-flex flex-column justify-content-center align-items-center">
        <h5>Datos para el pago</h5>

        <div>
          <h6 className="text-start mb-0">Banco Mercantil</h6>
          <p>
            Cta corriente Banco mercantil Supply tech C.A 01050100891100178104
            supplytech.soldaduras@gmail.com J-405080078
          </p>

          <h6 className="text-start mb-0">Banco de Venezuela</h6>
          <p>
            Cta corriente banco de Venezuela SUPPLY TECH 0102-0358-91-0000749264
            supplytech.soldaduras@gmail.com J-405080078
          </p>
        </div>

        <p className="mt-3">
          Una vez realizado el pago, ingrese el número de referencia o capture
          la pantalla de la transferencia
        </p>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="zelleReference">
            <Form.Label>Número de referencia</Form.Label>
            <Form.Control
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
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
          onClick={() => {
            setPaymentReference("");
            setImagen("");
            deleteConfimation();
          }}
          to={`/changepay/${order._id}`}
        >
          <GiCardExchange /> Cambiar el tipo de pago
        </Link>
      </ListGroup.Item>
    </>
  );
};

export default TransferPayment;
