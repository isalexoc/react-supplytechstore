import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Product from "../components/Product";
import {
  useGetAllProductsQuery,
  useGetProductByCategoryQuery,
} from "../slices/productsApiSlice";
import Paginate from "../components/Paginate";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import getDollarPrice from "../utils/dollarPrice";
import BackTo from "../components/BackTo";
import { PRODUCTS_URL } from "../constants";
import { GrCatalog } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import axios from "axios"; // Assuming axios is installed for making HTTP requests
import { toast } from "react-toastify";

const Catalog = () => {
  const { category: currentCategory, pageNumber: currentPageNumber } =
    useParams();

  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(
    currentCategory || ""
  );
  const [isPreparingDownload, setIsPreparingDownload] = useState(false);

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

  const [categoriesMapping, setCategoriesMapping] = useState({});
  const [dollar, setDollar] = useState(0);

  useEffect(() => {
    const fetchDollarPrice = async () => {
      const currentDollarPrice = await getDollarPrice();
      setDollar(currentDollarPrice);
    };

    fetchDollarPrice();
  }, []);

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
    const categoryA = categoriesMapping[a].toUpperCase();
    const categoryB = categoriesMapping[b].toUpperCase();
    return categoryA.localeCompare(categoryB);
  });

  const handleCategoryChange = (normalizedCategory) => {
    setSelectedCategory(normalizedCategory);
    navigate(`/products/${normalizedCategory}/page/1`);
  };

  const handleDownload = async () => {
    setIsPreparingDownload(true);
    if (userInfo) {
      try {
        const response = await axios.get(`${PRODUCTS_URL}/getcatalog`, {
          responseType: "blob", // Important for files like PDF
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "catalog.pdf");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading the catalog:", error);
        alert("Failed to download the catalog");
      }
    } else {
      toast.error("Debes iniciar sesión para descargar el catálogo");
    }

    setIsPreparingDownload(false);
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
              <div className="z-index-3 d-flex justify-content-center align-items-center">
                {isPreparingDownload ? (
                  <Loader />
                ) : (
                  <button
                    className="btn btn-primary btn-sm mb-3"
                    onClick={handleDownload}
                  >
                    <IoMdDownload /> Descargar Catálogo <GrCatalog />
                  </button>
                )}
              </div>
              <Form.Group
                as="select"
                className="d-md-none form-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((normalizedCategory, index) => (
                  <option key={index} value={normalizedCategory}>
                    {categoriesMapping[normalizedCategory]}
                  </option>
                ))}
              </Form.Group>
              <ListGroup className="d-none d-md-block">
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
              <Row className="overflow-hidden">
                {data?.products?.map((product) => (
                  <Col
                    key={product._id}
                    xs={6}
                    sm={4}
                    md={4}
                    lg={3}
                    xl={3}
                    className="px-1"
                  >
                    <Product product={product} dollar={dollar} />
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
      <BackTo />
    </>
  );
};

export default Catalog;
