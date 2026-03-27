import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Paginate from "../components/Paginate";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import ProductCarousel from "../components/ProductCarousel";
import Brands from "../components/Brands";
import ShowMap from "../components/ShowMap";
import CategoriesSlider from "../components/CategoriesSlider";
const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const dollar = useSelector((s) => s.exchangeRate.rate) ?? 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data.message || error.error}</Message>
      ) : (
        <>
          {keyword ? (
            <>
              <h1>Resultados para "{keyword}"</h1>
              <Link to="/" className="btn btn-light mb-4">
                Regresar
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-3">Productos Destacados</h2>
              <ProductCarousel dollar={dollar} />
              <h2 className="mt-5">Nuestra Marcas</h2>
              {data.page === 1 && <Brands />}
              <h2 className="mt-5">Categorías</h2>
              <CategoriesSlider />
              <h2 className="mt-5">Todos los Productos</h2>

              <Meta />
            </>
          )}

          <Row className="overflow-hidden">
            {data.products.map((product) => (
              <Col
                key={product._id}
                xs={6}
                sm={4}
                md={4}
                lg={3}
                xl={2}
                className="px-1"
              >
                <Product product={product} dollar={dollar} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            screen={`products/todos%20los%20productos`}
            keyword={keyword ? keyword : ""}
          />
          {data.page === 1 && <ShowMap />}
        </>
      )}
    </>
  );
};

export default HomeScreen;
