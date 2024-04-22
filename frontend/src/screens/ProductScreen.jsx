import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Image,
  ListGroup,
  Card,
  Button,
} from "react-bootstrap";
import Meta from "../components/Meta";
import Raiting from "../components/Raiting";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import BackTo from "../components/BackTo";
import getDollarPrice from "../utils/dollarPrice";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [dollar, setDollar] = useState(0);

  useEffect(() => {
    const fetchDollarPrice = async () => {
      const currentDollarPrice = await getDollarPrice();
      setDollar(currentDollarPrice);
    };

    fetchDollarPrice();
  }, []);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Reseña enviada");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data.message || error.error}</Message>
      ) : (
        <>
          <Meta
            title={product.name}
            description={product.description}
            keywords={product.name}
            contentImage={product.image}
            contentDescription={product.description}
            contentTitle={product.name}
            serviceUrl={`	https://www.supplytechstore.com/product/${product._id}`}
            serviceType="product"
          />
          <Row>
            <Col sm={6} md={6} lg={4}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col sm={6} md={6} lg={5}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Raiting
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Precio ${product.price}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col className="d-none d-lg-block mb-5">
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Precio:</Col>
                      <Col>
                        <div>
                          <strong>${product.price}</strong>
                        </div>
                        <div>
                          {dollar > 0
                            ? `Bs. ${(product.price * dollar).toFixed(2)}`
                            : ""}
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Estatus:</Col>
                      <Col>
                        {product.countInStock > 0
                          ? "Disponible"
                          : "No Disponible"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Cantidad</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    {!userInfo?.isAdmin && (
                      <Button
                        className="btn-block"
                        type="button"
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        Añadir al Carrito
                      </Button>
                    )}

                    {userInfo && userInfo?.isAdmin && (
                      <Button
                        className="btn-block"
                        type="button"
                        onClick={() =>
                          navigate(`/admin/product/${product._id}/edit`)
                        }
                      >
                        Editar
                      </Button>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <div className="d-lg-none mb-5">
            <Card>
              <Row className="p-2 justify-content-center align-items-center">
                <Col xs={6} sm={4} md={3}>
                  <p className="mb-0">Precio:</p>
                  <div>
                    <strong>${product.price}</strong>
                  </div>
                  <div>
                    {dollar > 0
                      ? `Bs. ${(product.price * dollar).toFixed(2)}`
                      : ""}
                  </div>
                </Col>
                <Col xs={6} sm={4} md={3}>
                  <p className="mb-0">Estatus</p>
                  <div>
                    <strong>
                      {product.countInStock > 0
                        ? "Disponible"
                        : "No Disponible"}
                    </strong>
                  </div>
                </Col>
                <Col xs={6} sm={4} md={3}>
                  <p className="mb-0">Cantidad</p>
                  <Form.Control
                    as="select"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col xs={6} sm={12} md={3} className="text-center">
                  {!userInfo?.isAdmin && (
                    <Button
                      className="btn-block mt-2 mt-md-0"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Añadir al Carrito
                    </Button>
                  )}

                  {userInfo && userInfo?.isAdmin && (
                    <Button
                      className="btn-block"
                      type="button"
                      onClick={() =>
                        navigate(`/admin/product/${product._id}/edit`)
                      }
                    >
                      Editar
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>
          </div>

          <Row>
            <Col md={12}>
              <h3>Descripción</h3>
              {/* Use dangerouslySetInnerHTML to render HTML */}
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </Col>
          </Row>
          <Row className="review">
            <Col md={6}>
              <h2>Reseñas</h2>
              {product.reviews.length === 0 && (
                <Message>No hay reseñas</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Raiting value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  {loadingProductReview && <Loader />}
                  {userInfo && !userInfo?.isAdmin ? (
                    <>
                      <h2>Escribe una reseña</h2>
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId="rating" className="my-2">
                          <Form.Label>Calificación</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="1">1 - Malo</option>
                            <option value="2">2 - Regular</option>
                            <option value="3">3 - Bueno</option>
                            <option value="4">4 - Muy Bueno</option>
                            <option value="5">5 - Excelente</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="comment">
                          <Form.Label>Comentario</Form.Label>
                          <Form.Control
                            as="textarea"
                            row="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Button
                          disabled={loadingProductReview}
                          type="submit"
                          variant="primary"
                        >
                          Enviar
                        </Button>
                      </Form>
                    </>
                  ) : !userInfo?.isAdmin ? (
                    <>
                      <h2>Escribe una reseña</h2>
                      <Message>
                        Por favor <Link to="/login">inicia sesión</Link> para
                        escribir una reseña
                      </Message>
                    </>
                  ) : (
                    ""
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
      <BackTo />
    </>
  );
};

export default ProductScreen;
