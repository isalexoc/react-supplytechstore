import cron from "node-cron";
import DailyExchangeRate from "../models/dailyExchangeRateModel.js";
import { getCaracasDateKey, fetchLiveExchangeSnapshot } from "../utils/exchangeRateUtils.js";
import { broadcastExchangeRate } from "../utils/broadcastExchangeRate.js";

const AUTO_NOTE = "Actualización automática diaria 06:00 (America/Caracas)";

/**
 * Fija la tasa del día (misma fórmula en vivo: BCV + USDT + brecha + pts extra) en la BD.
 */
export async function runDailyExchangeRateLock() {
  const dateKey = getCaracasDateKey();
  try {
    const snap = await fetchLiveExchangeSnapshot();
    if (
      snap.liveRate == null ||
      !Number.isFinite(snap.liveRate) ||
      snap.liveRate <= 0
    ) {
      console.error("[daily-rate] Sin tasa en vivo para", dateKey);
      return;
    }
    await DailyExchangeRate.findOneAndUpdate(
      { dateKey },
      {
        $set: {
          bsPerUsd: snap.liveRate,
          note: AUTO_NOTE,
        },
        $unset: { updatedBy: "" },
      },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(
      `[daily-rate] Tasa fijada ${dateKey}: ${snap.liveRate.toFixed(4)} Bs/USD (mercado+${snap.extraPercentagePointsUsed}% extra)`
    );
    await broadcastExchangeRate();
  } catch (e) {
    console.error("[daily-rate] Error:", e.message);
  }
}

export function startDailyExchangeRateScheduler() {
  if (
    process.env.DISABLE_DAILY_EXCHANGE_CRON === "true" ||
    process.env.DISABLE_DAILY_EXCHANGE_CRON === "1"
  ) {
    console.log("[daily-rate] Cron desactivado (DISABLE_DAILY_EXCHANGE_CRON)");
    return;
  }
  cron.schedule(
    "0 6 * * *",
    () => {
      runDailyExchangeRateLock();
    },
    { timezone: "America/Caracas" }
  );
  console.log(
    "[daily-rate] Programado: 06:00 America/Caracas (tasa del día automática)"
  );
}
