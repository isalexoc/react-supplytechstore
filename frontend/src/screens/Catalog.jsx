import React, { useEffect, useState, useRef } from "react";
import { Row, Col, ListGroup, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Product from "../components/Product";
import {
  useGetAllProductsQuery,
  useGetProductByCategoryQuery,
} from "../slices/productsApiSlice";
import Paginate from "../components/Paginate";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import BackTo from "../components/BackTo";
import { PRODUCTS_URL } from "../constants";
import { GrCatalog } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import { toast } from "react-toastify";
import CatalogDownloadModal, {
  formatBytes,
} from "../components/CatalogDownloadModal";

const Catalog = () => {
  const { category: currentCategory, pageNumber: currentPageNumber } =
    useParams();

  const { userInfo } = useSelector((state) => state.auth);
  const dollar = useSelector((s) => s.exchangeRate.rate) ?? 0;

  const navigate = useNavigate();
  const abortRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(
    currentCategory || ""
  );

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadIndeterminate, setDownloadIndeterminate] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [downloadBytes, setDownloadBytes] = useState(0);
  const [downloadCanCancel, setDownloadCanCancel] = useState(false);

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

  const handleCancelDownload = () => {
    abortRef.current?.abort();
  };

  const handleDownload = async () => {
    if (!userInfo) {
      toast.error("Debes iniciar sesión para descargar el catálogo");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setDownloadModalOpen(true);
    setDownloadIndeterminate(true);
    setDownloadProgress(null);
    setDownloadBytes(0);
    setDownloadCanCancel(true);
    setDownloadStatus(
      "Generando el PDF en el servidor. Puede tardar un minuto según la cantidad de productos…"
    );

    try {
      const response = await axios.get(`${PRODUCTS_URL}/getcatalog`, {
        responseType: "blob",
        withCredentials: true,
        signal: controller.signal,
        timeout: 300000,
        onDownloadProgress: (e) => {
          const loaded = e.loaded;
          const total = e.total;
          setDownloadBytes(loaded);

          if (total && total > 0) {
            setDownloadIndeterminate(false);
            setDownloadProgress(Math.min(100, Math.round((loaded * 100) / total)));
            setDownloadStatus("Descargando archivo…");
          } else if (loaded > 0) {
            setDownloadStatus(
              `Recibiendo datos… (${formatBytes(loaded)} descargados)`
            );
          }
        },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const date = new Date();
      const timestamp = `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}_${date
        .getHours()
        .toString()
        .padStart(2, "0")}${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}${date.getSeconds().toString().padStart(2, "0")}`;
      const filename = `productos-supplytechstore_${timestamp}.pdf`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadIndeterminate(false);
      setDownloadProgress(100);
      setDownloadStatus("Descarga completada.");
      toast.success("Catálogo descargado correctamente");
    } catch (error) {
      if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
        toast.info("Descarga cancelada");
      } else {
        console.error("Error downloading the catalog:", error);
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "No se pudo descargar el catálogo";
        toast.error(typeof msg === "string" ? msg : "Error al descargar");
      }
    } finally {
      setDownloadCanCancel(false);
      abortRef.current = null;
      setDownloadModalOpen(false);
    }
  };

  return (
    <>
      <Meta title="Catálogo" />
      <CatalogDownloadModal
        show={downloadModalOpen}
        progress={downloadProgress}
        indeterminate={downloadIndeterminate}
        statusLabel={downloadStatus}
        bytesLoaded={downloadBytes}
        onCancel={handleCancelDownload}
        canCancel={downloadCanCancel}
      />
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
                <button
                  type="button"
                  className="btn btn-primary btn-sm mb-3 d-inline-flex align-items-center gap-2"
                  onClick={handleDownload}
                  disabled={downloadModalOpen}
                >
                  <IoMdDownload />
                  Descargar catálogo
                  <GrCatalog />
                </button>
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
