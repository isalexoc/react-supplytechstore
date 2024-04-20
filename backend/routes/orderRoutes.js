import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  updatePaymentMethod,
  updateOrderZelle,
  markAsPaid,
  getInvoice,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/markAsPaid").put(protect, admin, markAsPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/changePay").put(protect, updatePaymentMethod);
router.route("/updateOrderZelle").put(protect, updateOrderZelle);
router.route("/getInvoice/:id").get(protect, getInvoice);

export default router;
