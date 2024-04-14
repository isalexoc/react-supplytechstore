import { Link } from "react-router-dom";
import { Carousel, Image, Row, Col } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = ({ dollar }) => {
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
            <Row className="">
              <Col
                xs={12}
                sm={6}
                xl={4}
                className="d-flex justify-content-center align-items-center"
              >
                <Image src={product.image} alt={product.name} fluid />
              </Col>
              <Col
                xs={12}
                sm={6}
                xl={8}
                className="d-none d-sm-flex justify-content-center align-items-center"
              >
                <div className="product-description text-white text-center">
                  <h5 className="product-carousel-name p-sm-1">
                    {product.name.length > 80
                      ? `${product.name.substring(0, 82)}...`
                      : product.name}
                  </h5>
                  <p className="d-none d-lg-block">
                    {product.description.length > 150
                      ? `${product.description.substring(0, 147)}...`
                      : product.description}
                  </p>
                  <div>
                    <h5 className="mb-0">${product.price}</h5>
                    {dollar > 0 && (
                      <h6 className="mb-sm-5">
                        Bs. {(product.price * dollar).toFixed(2)}
                      </h6>
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            <Carousel.Caption className="carousel-caption">
              <div className="d-sm-none">
                <h2 className="mb-0">{product.name}</h2>
                <h5 className="mb-0">${product.price}</h5>
                {dollar > 0 && (
                  <h6 className="mb-0">
                    Bs. {(product.price * dollar).toFixed(2)}
                  </h6>
                )}
              </div>
              <div className="d-none d-sm-block">
                <h2 className="mb-0 uppercase">VER PRODUCTO</h2>
              </div>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
