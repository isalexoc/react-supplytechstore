import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Product from "../components/Product";
import {
  useGetAllProductsQuery,
  useGetProductByCategoryQuery,
} from "../slices/productsApiSlice";
import Paginate from "../components/Paginate";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";

const Catalog = () => {
  const { category: currentCategory, pageNumber: currentPageNumber } =
    useParams();
  const navigate = useNavigate();

  // Initialize state for all products and selected category
  const [selectedCategory, setSelectedCategory] = useState(
    currentCategory || ""
  );
  const pageNumber = parseInt(currentPageNumber) || 1;

  const {
    data: allProducts,
    isLoading: loadingAllProducts,
    error: allProductsError,
  } = useGetAllProductsQuery();

  const { data, error, isLoading } = useGetProductByCategoryQuery({
    category: selectedCategory,
    pageNumber,
  });

  // To store and display categories
  const [categoriesMapping, setCategoriesMapping] = useState({});

  useEffect(() => {
    if (allProducts) {
      const uniqueCategories = new Set();
      const mapping = {};

      allProducts.forEach((product) => {
        product.category.split(",").forEach((category) => {
          const normalizedCategory = category.trim().toLowerCase();
          uniqueCategories.add(normalizedCategory);

          if (!mapping[normalizedCategory]) {
            mapping[normalizedCategory] = category.trim();
          }
        });
      });

      setCategoriesMapping(mapping);
    }
  }, [allProducts]);

  const categories = Object.keys(categoriesMapping).sort((a, b) => {
    // Use the mapping to get the original category names for comparison
    const categoryA = categoriesMapping[a].toUpperCase(); // Ignore upper and lowercase
    const categoryB = categoriesMapping[b].toUpperCase(); // Ignore upper and lowercase
    if (categoryA < categoryB) {
      return -1;
    }
    if (categoryA > categoryB) {
      return 1;
    }

    // Names must be equal
    return 0;
  });

  // Handle category selection
  const handleCategoryChange = (normalizedCategory) => {
    setSelectedCategory(normalizedCategory);
    navigate(`/products/${normalizedCategory}/page/1`);
  };

  return (
    <>
      <Meta title="Catálogo" />
      {isLoading || loadingAllProducts ? (
        <Loader />
      ) : error || allProductsError ? (
        <Message variant="danger">
          {error?.data.message ||
            error?.error ||
            allProductsError?.data?.message ||
            allProductsError?.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={3}>
              <h3>Categorías</h3>
              <ListGroup>
                {categories.map((normalizedCategory, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => handleCategoryChange(normalizedCategory)}
                    active={normalizedCategory === selectedCategory}
                  >
                    {categoriesMapping[normalizedCategory]}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={9}>
              <Row>
                {data?.products?.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Paginate
                pages={data?.pages}
                page={pageNumber}
                screen={`products/${selectedCategory}`}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Catalog;
