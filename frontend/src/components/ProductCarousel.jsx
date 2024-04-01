import { Link } from "react-router-dom";
import { Carousel, Image, Row, Col } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {
  const { data: products, error, isLoading } = useGetTopProductsQuery();
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-primary mb-4">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link
            to={`/product/${product._id}`}
            className="d-flex text-decoration-none"
          >
            <Row>
              <Col
                sm={12}
                lg={6}
                className="d-flex justify-content-center align-items-center"
              >
                <Image src={product.image} alt={product.name} fluid />
              </Col>
              <Col
                sm={12}
                lg={6}
                className="d-none d-lg-flex justify-content-center align-items-center"
              >
                <div className="product-description text-white text-center">
                  <h3>{product.name}</h3>
                  <p>
                    {product.description.length > 150
                      ? `${product.description.substring(0, 147)}...`
                      : product.description}
                  </p>
                  <h2>${product.price}</h2>
                </div>
              </Col>
            </Row>

            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} ({product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
