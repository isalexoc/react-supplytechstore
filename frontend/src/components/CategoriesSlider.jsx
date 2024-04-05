import { Carousel, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useGetCategoriesQuery } from "../slices/productsApiSlice";
import Loader from "./Loader";
import Message from "./Message";

const CategoriesSlider = () => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  // Chunking logic remains the same
  const chunkSize = 4;
  const chunks = categories
    ? Array(Math.ceil(categories.length / chunkSize))
        .fill()
        .map((_, index) => index * chunkSize)
        .map((begin) => categories.slice(begin, begin + chunkSize))
    : [];

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.toString()}</Message>;

  return (
    <Carousel>
      {chunks.map((chunk, index) => (
        <Carousel.Item key={index}>
          <Row className="justify-content-center">
            {chunk.map((category) => (
              <Col
                key={category._id}
                xl={3}
                lg={3}
                md={3}
                sm={6}
                xs={6}
                className="mb-3"
              >
                <LinkContainer
                  to={`/products/${category.name.toLowerCase()}/page/1`}
                >
                  <div
                    className="category-card position-relative"
                    role="button"
                  >
                    <img
                      src={category.image || "https://via.placeholder.com/150"}
                      alt={category.name}
                      className="category-image"
                    />
                    <div className="category-overlay">
                      <div className="category-text">{category.name}</div>
                    </div>
                  </div>
                </LinkContainer>
              </Col>
            ))}
          </Row>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CategoriesSlider;
