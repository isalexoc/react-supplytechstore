import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getAllProducts,
  getProductByCategory,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  updateProductImages,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

// Fetch all products
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id/reviews").post(protect, checkObjectId, createProductReview);
router.route("/top").get(getTopProducts);
router.route("/allproducts").get(getAllProducts);
router.route("/category").get(getProductByCategory);
router
  .route("/categories")
  .get(getCategories)
  .post(protect, admin, createCategory);
router
  .route("/categories/:id")
  .put(protect, admin, checkObjectId, updateCategory)
  .delete(protect, admin, checkObjectId, deleteCategory);

// Fetch single product
router
  .route("/:id")
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

router
  .route("/:id/updateImages")
  .put(protect, admin, checkObjectId, updateProductImages);

export default router;
