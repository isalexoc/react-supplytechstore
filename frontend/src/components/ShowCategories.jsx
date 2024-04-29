import { useState } from "react";
import {
  useGetCategoriesQuery,
  useUploadProductImageMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../slices/productsApiSlice";
import { useDispatch } from "react-redux";
import { setImagesToState } from "../slices/authSlice";
import { capitalizeString } from "../utils/capitlizeString";
import { Form, Table, Button } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const ShowCategories = () => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();

  const [uploadProductImage, { isLoading: loadingUpload, error: errorUpload }] =
    useUploadProductImageMutation();

  const [createCategory, { isLoading, error }] = useCreateCategoryMutation();

  const [deleteCategory, { isLoading: loadingDelete }] =
    useDeleteCategoryMutation();

  const [updateCategory, { isLoading: loadingUpdate }] =
    useUpdateCategoryMutation();

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      dispatch(setImagesToState(res.imageData));
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleCatChange = (categoryId) => {
    if (categoryId === "") {
      setSelectedCategory(null);
      return;
    }
    // search for the category by id
    const categorySelected = categories.find((cat) => cat._id === categoryId);
    // set the category
    setSelectedCategory(categorySelected);
  };

  const deleteHandler = async (id) => {
    if (window.confirm("¿Deseas borrar la categoría?")) {
      try {
        await deleteCategory(id);
        toast.success("categoria borrada");
        setSelectedCategory(null);
        refetchCategories();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const updateHandler = async (id) => {
    setIsEdit(true);
    const category = categories.find((cat) => cat._id === id);
    setName(category.name);
    setImage(category.image);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (name === "") {
      toast.error("El campo de nombre no puede estar vacío");
      return;
    }
    if (image === "") {
      toast.error("El campo de imagen no puede estar vacío");
      return;
    }

    if (isEdit) {
      try {
        await updateCategory({
          categoryId: selectedCategory._id,
          name,
          image,
        }).unwrap();
        setName("");
        setImage("");
        setIsEdit(false);
        setSelectedCategory(null);
        refetchCategories();
        toast.success("Categoría actualizada");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
      return;
    }

    try {
      await createCategory({ name, image }).unwrap();
      setName("");
      setImage("");
      refetchCategories();
      toast.success("Categoría creada");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <div className="bg-light p-2 rounded">
        <h2>Todas las Categorías</h2>
        {categoriesLoading || isLoading || loadingDelete || loadingUpdate ? (
          <Loader />
        ) : categoriesError || error || errorUpload ? (
          <Message variant="danger">
            {categoriesError || error?.data || errorUpload?.data}
          </Message>
        ) : (
          //display the categories on a table
          <Form.Group
            as="select"
            onChange={(e) => handleCatChange(e.target.value)}
            className="form-select"
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {capitalizeString(category.name)}
              </option>
            ))}
          </Form.Group>
        )}

        {selectedCategory !== null && (
          //display the category details
          <>
            <h2 className="mt-3">Detalles de la categoría</h2>
            <Table striped bordered hover responsive className="table-sm">
              <tbody>
                <tr>
                  <td>Nombre</td>
                  <td>{selectedCategory.name}</td>
                </tr>
                <tr>
                  <td>Imagen</td>
                  <td>
                    <img
                      src={selectedCategory.image}
                      alt={selectedCategory.name}
                      width={100}
                      className="img-fluid"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Acciones</strong>
                  </td>
                  <td>
                    <Button
                      onClick={() => updateHandler(selectedCategory._id)}
                      variant="light"
                      className="btn-sm mx-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      onClick={() => deleteHandler(selectedCategory._id)}
                      variant="danger"
                      className="btn-sm"
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </>
        )}
      </div>

      <h2 className={isEdit ? "" : "mt-5"}>
        {isEdit ? "Editar Categoría" : "Crear Categoría"}
      </h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-2">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="image" className="my-2">
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            type="text"
            placeholder="Imagen de la categoría"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></Form.Control>
          <Form.Control
            type="file"
            label="Selecciona la imagen"
            onChange={uploadFileHandler}
          ></Form.Control>
        </Form.Group>
        <button type="submit" className="btn btn-primary mt-3">
          {isEdit ? "Actualizar" : "Crear"}
        </button>
        {loadingUpload && <Loader />}
      </Form>
    </>
  );
};

export default ShowCategories;
