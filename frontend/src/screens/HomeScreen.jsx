import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Paginate from "../components/Paginate";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import ProductCarousel from "../components/ProductCarousel";
import BannerVideo from "../components/BannerVideo";
import Brands from "../components/Brands";
import ShowMap from "../components/ShowMap";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

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
              {data.page === 1 && <BannerVideo />}
              <h2 className="mt-5">Productos Destacados</h2>
              <ProductCarousel />
              <h2 className="mt-5">Nuestra Marcas</h2>
              {data.page === 1 && <Brands />}
              <h2 className="mt-5">Todos los Productos</h2>

              <Meta />
            </>
          )}

          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
          {data.page === 1 && <ShowMap />}
        </>
      )}
    </>
  );
};

export default HomeScreen;
