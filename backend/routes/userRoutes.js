import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  saveSubscriber,
  checkSubscriber,
  unsubscribeNewsletter,
  contactForm,
  googleLogin,
  forgotPassword,
  resetPassword,
  removeAccount,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { authRouteLimiter } from "../middleware/rateLimiter.js";

router.route("/").post(authRouteLimiter, registerUser).get(protect, admin, getUsers);
router.post("/logout", logoutUser);
router.post("/auth", authRouteLimiter, authUser);
router.post("/google", authRouteLimiter, googleLogin);
router
  .route("/subscribe")
  .post(authRouteLimiter, saveSubscriber)
  .get(checkSubscriber)
  .delete(unsubscribeNewsletter);
router.route("/contact").post(authRouteLimiter, contactForm);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);
router.route("/forgotpassword").post(authRouteLimiter, forgotPassword);
router.route("/resetpassword").post(authRouteLimiter, resetPassword);
router.route("/deleteaccount").post(protect, removeAccount);
export default router;
