import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Raiting from "./Raiting";

const Product = ({ product, dollar }) => {
  return (
    <Card className="my-1 p-1 my-sm-3 p-sm-3 rounded card-container">
      <Row>
        <Col sm={12}>
          <Link to={`/product/${product._id}`}>
            <Card.Img
              src={product?.images[0] ? product?.images[0].url : product.image}
              variant="top"
              alt={product.name}
            />
          </Link>
        </Col>
        <Col sm={12} className="px-0">
          <Card.Body>
            <Link to={`/product/${product._id}`}>
              <Card.Title as="div" className="product-title">
                <strong>{product.name}</strong>
              </Card.Title>
            </Link>
            <Card.Text as="div">
              <Raiting
                value={product.rating}
                text={`${product.numReviews} comentarios`}
              />
            </Card.Text>

            {/* Benjamin request to show only bs price */}
            {/*  <Card.Text as="h3" className="mb-0">
              ${product.price}
            </Card.Text>
            <Card.Text as="p">
              {dollar > 0 ? `Bs. ${(product.price * dollar).toFixed(2)}` : ""}
            </Card.Text> */}

            <Card.Text as="h5" className="mb-0">
              {dollar > 0 ? `Bs. ${(product.price * dollar).toFixed(2)}` : ""}
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default Product;
