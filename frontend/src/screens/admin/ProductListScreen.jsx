import { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Image } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import Meta from "../../components/Meta";
import { PRODUCTS_URL } from "../../constants";

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, error, isLoading, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const [isPreparingDownload, setIsPreparingDownload] = useState(false);

  const deleteHandler = async (id) => {
    if (window.confirm("¿Deseas borrar el producto?")) {
      try {
        await deleteProduct(id);
        toast.success("Producto borrado");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("¿Deseas crear un nuevo producto?")) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title="Admin-Productos" />
      <Row className="align-items-center">
        <Col>
          <h1>Productos</h1>
          {isPreparingDownload ? (
            <Loader />
          ) : (
            <a
              href={`${PRODUCTS_URL}/getcatalog`}
              download
              className="btn btn-primary btn-sm mb-3"
              onClick={() => {
                setIsPreparingDownload(true);
                setTimeout(() => {
                  setIsPreparingDownload(false); // reset after 2 seconds, adjust as needed
                }, 2000);
              }}
            >
              Descargar Catálogo
            </a>
          )}
        </Col>
        <Col className="text-end">
          <Button onClick={createProductHandler} className="m-3 btn-sm">
            <FaEdit /> Crear Producto
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Imagen</th>
                <th>NOMBRE</th>
                <th>PRECIO</th>
                <th>CATEGORÍA</th>
                <th>MARCA</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product, index) => (
                <tr key={product._id}>
                  <td>
                    {data.page === 1
                      ? index + 1
                      : index + 1 + (data.page - 1) * 12}
                  </td>
                  <td>
                    <Image
                      width={100}
                      src={product.image}
                      alt={product.name}
                      fluid
                    />
                  </td>
                  <td>
                    <LinkContainer to={`/product/${product._id}`}>
                      <div className="link-style">{product.name}</div>
                    </LinkContainer>
                  </td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      onClick={() => deleteHandler(product._id)}
                      variant="danger"
                      className="btn-sm"
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="my-2">
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </div>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
