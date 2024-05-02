import { useState, useEffect /*, useCallback*/ } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImagesMutation,
  useGetCategoriesQuery,
  // useDeleteImagesMutation,
} from "../../slices/productsApiSlice";
import { capitalizeString } from "../../utils/capitlizeString";
import Meta from "../../components/Meta";
import TextEditor from "../../components/TextEditor";
import ImageDisplay from "../../components/ImageDisplay";
import VideoUpload from "../../components/VideoUpload";
import { UPLOAD_URL } from "../../constants";

const ProductEditScreen = () => {
  const { id: productID } = useParams();
  const navigate = useNavigate();

  const {
    data: product,
    refetch,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productID);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImages, { isLoading: loadingUpload }] =
    useUploadProductImagesMutation();

  //const [deleteImages] = useDeleteImagesMutation();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [productVideo, setProductVideo] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [videoUploaded, setVideoUploaded] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name === " " ? "" : product.name);
      setPrice(product.price);
      setBrand(product.brand === " " ? "" : product.brand);
      setImages(product.images || []);
      setCategory(product.category === " " ? "" : product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description === " " ? "" : product.description);
      setProductVideo(product.video || []);
    }
  }, [product]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 6) {
      toast.error("Máximo 6 imágenes permitidas");
      return;
    }
    setSelectedFiles(files);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let imageData = null;
    let videoFile = null;

    if (selectedFiles) {
      if (selectedFiles?.length > 6) {
        toast.error("Máximo 6 imágenes permitidas");
        return;
      }

      try {
        imageData = await uploadFileHandler(selectedFiles);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }

      if (!imageData) {
        return;
      }
    }

    if (videoUploaded) {
      try {
        videoFile = await uploadVideoHandler(videoUploaded);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }

      if (!videoFile) {
        return;
      }
    }

    if (category === "seleccionar" || category === "") {
      toast.error("Por favor selecciona una categoría");
      return;
    }
    try {
      await updateProduct({
        productId: productID,
        name,
        price,
        brand,
        video: videoFile ? videoFile : productVideo,
        //on the category include "todos los productos" along with the rest of the categories
        category: category + ", todos los productos",
        images: imageData ? imageData : images,
        description,
        countInStock,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success("Producto actualizado exitosamente");
      //dispatch(clearImages());
      refetch();
      navigate(`/product/${productID}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (files) => {
    const formData = new FormData();

    // Append all files to the same form data object
    Array.from(files).forEach((file) => {
      formData.append("image", file);
    });

    try {
      // Make a single request to upload all files
      const res = await uploadProductImages(formData).unwrap();
      return res.imageData;
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }

    /* formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } */
  };

  const uploadVideoHandler = async (video) => {
    const file = video;

    const formData = new FormData();
    formData.append("video", file);

    setUploading(true);
    try {
      const response = await fetch(`${UPLOAD_URL}/video`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Video uploaded successfully!");
        return data;
      } else {
        throw new Error(data.message || "Failed to upload video");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  /* const handleDeleteImages = useCallback(async () => {
    try {
      //await deleteImages({ imagesData: images });
      dispatch(clearImages());
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (imageUrls.length > 0) {
        handleDeleteImages();
      }
    };
  }, [imageUrls, handleDeleteImages, images]);
 */

  if (categoriesLoading || isLoading) return <Loader />;
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

              {images.length > 0 && (
                <ImageDisplay
                  images={images}
                  label="Imágenes Actuales"
                  setImages={setImages}
                />
              )}

              <Form.Group controlId="images" className="my-2">
                <Form.Label>
                  Imágenes (Máximo 6) Formato: JPG, JPEG o PNG
                </Form.Label>
                <Form.Control
                  type="file"
                  label="Selecciona las imágenes"
                  name="images"
                  multiple // Add this line to allow multiple files
                  onChange={handleFileChange}
                ></Form.Control>
              </Form.Group>

              <VideoUpload
                productVideo={productVideo}
                setVideoUploaded={setVideoUploaded}
                uploading={uploading}
              />

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
                <TextEditor
                  description={description}
                  setDescription={setDescription}
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="my-2">
                Actualizar
              </Button>
              {loadingUpload && <Loader />}
              {uploading && <Loader />}
            </Form>
          )}
        </FormContainer>
      </>
    );
  }
};

export default ProductEditScreen;
