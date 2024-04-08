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
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/logout", logoutUser);
router.post("/auth", authUser);
router.post("/google", googleLogin);
router
  .route("/subscribe")
  .post(saveSubscriber)
  .get(checkSubscriber)
  .delete(unsubscribeNewsletter);
router.route("/contact").post(contactForm);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);
router.route("/forgotpassword").post(forgotPassword);

export default router;
