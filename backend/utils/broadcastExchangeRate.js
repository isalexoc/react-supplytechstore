import { getIO } from "../socketInstance.js";
import { resolveEffectiveBs } from "./resolveEffectiveExchangeRate.js";
import { getCaracasDateKey } from "./exchangeRateUtils.js";

/**
 * Recomputes the effective public Bs/USD for Caracas "today" and pushes to all connected clients.
 */
export async function broadcastExchangeRate() {
  try {
    const io = getIO();
    if (!io) return;
    const dateKey = getCaracasDateKey();
    const result = await resolveEffectiveBs(dateKey);
    if (result.rate == null) return;
    io.emit("exchangeRate", {
      rate: result.rate,
      source: result.source,
      dateKey,
    });
  } catch (e) {
    console.error("[socket] broadcastExchangeRate", e.message);
  }
}
