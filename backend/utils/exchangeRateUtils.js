import ExchangeSettings from "../models/exchangeSettingsModel.js";

/** Predeterminado si no hay valor en BD (ExchangeSettings). */
export const EXTRA_PERCENTAGE_POINTS = 3;

const DOLARAPI_URL = "https://ve.dolarapi.com/v1/dolares";
const BINANCE_P2P_SEARCH =
  "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

/**
 * Calendar date in America/Caracas as YYYY-MM-DD (for daily locked rates).
 */
export function getCaracasDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Caracas",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !d) {
    return date.toISOString().slice(0, 10);
  }
  return `${y}-${m}-${d}`;
}

function getPromedioByFuente(list, fuente) {
  const row = list.find(
    (r) =>
      r?.fuente === fuente &&
      typeof r?.promedio === "number" &&
      Number.isFinite(r.promedio)
  );
  return row?.promedio ?? null;
}

function medianOfNumbers(numbers) {
  if (!numbers.length) return null;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Median VES/USDT from Binance P2P (first page of BUY USDT with VES).
 * @returns {Promise<number|null>}
 */
export async function fetchBinanceUsdtVesMedian() {
  const res = await fetch(BINANCE_P2P_SEARCH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      asset: "USDT",
      fiat: "VES",
      merchantCheck: false,
      page: 1,
      publisherType: null,
      rows: 20,
      tradeType: "BUY",
      payTypes: [],
    }),
  });
  if (!res.ok) {
    throw new Error(`Binance P2P HTTP ${res.status}`);
  }
  const json = await res.json();
  if (!json?.success || json.code !== "000000") {
    throw new Error(json?.message || "Binance P2P error");
  }
  const ads = Array.isArray(json.data) ? json.data : [];
  const prices = ads
    .map((row) => {
      const p = row?.adv?.price;
      if (typeof p === "number" && Number.isFinite(p)) return p;
      if (typeof p === "string") {
        const n = parseFloat(p.replace(",", "."));
        return Number.isFinite(n) ? n : NaN;
      }
      return NaN;
    })
    .filter((n) => Number.isFinite(n) && n > 0);
  if (prices.length === 0) return null;
  return medianOfNumbers(prices);
}

/**
 * BCV × (1 + (brechaMercado + puntosExtra) / 100).
 * @param {number} extraPoints — suma sobre BCV (configurable en admin; predeterminado 3).
 */
export function effectiveBsFromBcvAndGapPercent(bcv, gapPercent, extraPoints) {
  const extra =
    extraPoints != null && Number.isFinite(extraPoints)
      ? extraPoints
      : EXTRA_PERCENTAGE_POINTS;
  if (
    bcv == null ||
    gapPercent == null ||
    bcv <= 0 ||
    !Number.isFinite(gapPercent)
  ) {
    return null;
  }
  const adjustedPercent = gapPercent + extra;
  return bcv * (1 + adjustedPercent / 100);
}

/**
 * Bs per USD: BCV × (1 + (brecha + puntos extra) / 100), brecha = (mercado − BCV) / BCV × 100.
 * Usa EXTRA_PERCENTAGE_POINTS fijo (solo para rutas deprecadas sin BD).
 */
export function effectiveBsFromBcvAndMarket(bcv, marketPrice) {
  if (bcv == null || marketPrice == null || bcv <= 0) {
    return null;
  }
  const gapPercent = ((marketPrice - bcv) / bcv) * 100;
  return effectiveBsFromBcvAndGapPercent(bcv, gapPercent, EXTRA_PERCENTAGE_POINTS);
}

export async function getResolvedExtraPercentagePoints() {
  try {
    const doc = await ExchangeSettings.findOne({ key: "global" }).lean();
    const v = doc?.extraPercentagePoints;
    if (v != null && typeof v === "number" && Number.isFinite(v)) {
      return v;
    }
  } catch {
    /* fall through */
  }
  return EXTRA_PERCENTAGE_POINTS;
}

/**
 * Snapshot from already-fetched DolarApi JSON (sin USDT; solo referencia paralelo).
 * @deprecated Usar fetchLiveExchangeSnapshot para tasa en vivo con USDT.
 */
export function snapshotFromDolarApiData(data) {
  const list = Array.isArray(data) ? data : [];
  const bcv = getPromedioByFuente(list, "oficial");
  const paralelo = getPromedioByFuente(list, "paralelo");
  let gapPercent = null;
  if (bcv > 0 && paralelo != null) {
    gapPercent = ((paralelo - bcv) / bcv) * 100;
  }
  const liveRate = effectiveBsFromBcvAndMarket(bcv, paralelo);
  return { bcv, paralelo, gapPercent, liveRate };
}

/**
 * BCV + USDT (Binance) + brecha mercado; puntos extra editables en ExchangeSettings.
 * @returns {{
 *   bcv: number|null,
 *   paralelo: number|null,
 *   usdt: number|null,
 *   gapMarket: 'usdt'|'paralelo'|null,
 *   marketPrice: number|null,
 *   gapPercentMarket: number|null,
 *   gapPercent: number|null,
 *   extraPercentagePointsUsed: number,
 *   liveRate: number|null
 * }}
 */
export async function fetchLiveExchangeSnapshot() {
  const response = await fetch(DOLARAPI_URL);
  if (!response.ok) {
    throw new Error(`DolarApi HTTP ${response.status}`);
  }
  const data = await response.json();
  const list = Array.isArray(data) ? data : [];
  const bcv = getPromedioByFuente(list, "oficial");
  const paralelo = getPromedioByFuente(list, "paralelo");

  let usdt = null;
  try {
    usdt = await fetchBinanceUsdtVesMedian();
  } catch {
    /* Binance opcional */
  }

  const gapMarket =
    usdt != null ? "usdt" : paralelo != null ? "paralelo" : null;
  const marketPrice = usdt ?? paralelo;

  let gapPercentMarket = null;
  if (bcv > 0 && marketPrice != null) {
    gapPercentMarket = ((marketPrice - bcv) / bcv) * 100;
  }

  const extraPts = await getResolvedExtraPercentagePoints();

  const liveRate = effectiveBsFromBcvAndGapPercent(
    bcv,
    gapPercentMarket,
    extraPts
  );

  return {
    bcv,
    paralelo,
    usdt,
    gapMarket,
    marketPrice,
    gapPercentMarket,
    gapPercent: gapPercentMarket,
    extraPercentagePointsUsed: extraPts,
    liveRate,
  };
}

/**
 * @deprecated Alias de fetchLiveExchangeSnapshot (nombre anterior).
 */
export async function fetchDolarApiSnapshot() {
  return fetchLiveExchangeSnapshot();
}

/**
 * Live Bs/USD: brecha mercado + puntos extra (BD o 3 por defecto).
 * @returns {Promise<number|null>}
 */
export async function computeLiveBsFromDolarApi() {
  const snap = await fetchLiveExchangeSnapshot();
  return snap.liveRate;
}
