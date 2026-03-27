import DailyExchangeRate from "../models/dailyExchangeRateModel.js";
import {
  getCaracasDateKey,
  fetchLiveExchangeSnapshot,
} from "./exchangeRateUtils.js";

/**
 * Locked daily rate for dateKey (Caracas calendar day), else live DolarApi formula.
 */
export async function resolveEffectiveBs(dateKey = getCaracasDateKey()) {
  const locked = await DailyExchangeRate.findOne({ dateKey });
  if (
    locked &&
    typeof locked.bsPerUsd === "number" &&
    Number.isFinite(locked.bsPerUsd) &&
    locked.bsPerUsd > 0
  ) {
    return {
      rate: locked.bsPerUsd,
      source: "locked",
      dateKey,
      lockedId: locked._id,
    };
  }
  const snap = await fetchLiveExchangeSnapshot();
  if (snap.liveRate == null) {
    return {
      rate: null,
      source: "live",
      dateKey,
      error: "dolarapi_unavailable",
    };
  }
  return {
    rate: snap.liveRate,
    source: "live",
    dateKey,
    extraPercentagePoints: snap.extraPercentagePointsUsed,
  };
}
