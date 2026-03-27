import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getPublicExchangeRate,
  getAdminExchangeStatus,
  upsertDailyExchangeRate,
  deleteDailyExchangeRate,
  syncExchangeRateFromLive,
  updateExchangeExtraPoints,
} from "../controllers/settingsController.js";

const router = express.Router();

router.get("/exchange-rate", getPublicExchangeRate);
router.get("/exchange-rate/status", protect, admin, getAdminExchangeStatus);
router.put("/exchange-rate", protect, admin, upsertDailyExchangeRate);
router.put("/exchange-extra-points", protect, admin, updateExchangeExtraPoints);
router.post("/exchange-rate/sync-from-live", protect, admin, syncExchangeRateFromLive);
router.delete("/exchange-rate/:dateKey", protect, admin, deleteDailyExchangeRate);

export default router;
