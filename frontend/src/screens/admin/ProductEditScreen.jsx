import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
  useGetCategoriesQuery,
} from "../../slices/productsApiSlice";
import { capitalizeString } from "../../utils/capitlizeString";
import Meta from "../../components/Meta";

const ProductEditScreen = () => {
  const { id: productID } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    refetch,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productID);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name === " " ? "" : product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand === " " ? "" : product.brand);
      setCategory(product.category === " " ? "" : product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description === " " ? "" : product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (category === "seleccionar" || category === "") {
      toast.error("Por favor selecciona una categoría");
      return;
    }
    try {
      await updateProduct({
        productId: productID,
        name,
        price,
        image,
        brand,
        //on the category include "todos los productos" along with the rest of the categories
        category: category + ", todos los productos",
        description,
        countInStock,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success("Producto actualizado exitosamente");
      refetch();
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (categoriesLoading) return <Loader />;
  else if (categoriesError)
    return <Message variant="danger">{categoriesError?.data?.message}</Message>;
  else {
    return (
      <>
        <Meta title="Admin-Editar Producto" />
        <Link to="/admin/productlist" className="btn btn-light my-3">
          Ir Atrás
        </Link>
        <FormContainer>
          <h1>Editar Producto</h1>
          {loadingUpdate && <Loader />}

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error.data.message}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre del Producto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="price" className="my-2">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Precio"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="image" className="my-2">
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Imagen"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>
                <Form.Control
                  type="file"
                  label="Selecciona la imagen"
                  name="image"
                  onChange={uploadFileHandler}
                ></Form.Control>
              </Form.Group>
              {loadingUpload && <Loader />}

              <Form.Group controlId="brand" className="my-2">
                <Form.Label>Marca</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Marca"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="countInStock" className="my-2">
                <Form.Label>Unidades en Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Unidades en Stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="category" className="my-2">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="seleccionar">Selecciona la categoría</option>
                  {categories.map((item, index) => (
                    <option key={index} value={item?.name}>
                      {capitalizeString(item?.name)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="description" className="my-2">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary" className="my-2">
                Actualizar
              </Button>
            </Form>
          )}
        </FormContainer>
      </>
    );
  }
};

export default ProductEditScreen;
