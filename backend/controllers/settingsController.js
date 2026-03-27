import asyncHandler from "../middleware/asyncHandler.js";
import DailyExchangeRate from "../models/dailyExchangeRateModel.js";
import ExchangeSettings from "../models/exchangeSettingsModel.js";
import {
  getCaracasDateKey,
  computeLiveBsFromDolarApi,
  fetchDolarApiSnapshot,
  fetchLiveExchangeSnapshot,
  getResolvedExtraPercentagePoints,
  EXTRA_PERCENTAGE_POINTS,
} from "../utils/exchangeRateUtils.js";
import { resolveEffectiveBs } from "../utils/resolveEffectiveExchangeRate.js";
import { broadcastExchangeRate } from "../utils/broadcastExchangeRate.js";

// @route   GET /api/settings/exchange-rate
// @access  Public
const getPublicExchangeRate = asyncHandler(async (req, res) => {
  const dateKey =
    typeof req.query.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
      ? req.query.date
      : getCaracasDateKey();

  const result = await resolveEffectiveBs(dateKey);
  if (result.rate == null) {
    res.status(503);
    throw new Error(
      "No hay tasa disponible. Configure la tasa del día en administración o intente más tarde."
    );
  }

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  const extraPts = await getResolvedExtraPercentagePoints();

  res.json({
    rate: result.rate,
    source: result.source,
    dateKey,
    extraPercentagePoints: extraPts,
  });
});

// @route   GET /api/settings/exchange-rate/status
// @access  Private/Admin
const getAdminExchangeStatus = asyncHandler(async (req, res) => {
  const dateKey =
    typeof req.query.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
      ? req.query.date
      : getCaracasDateKey();

  const locked = await DailyExchangeRate.findOne({ dateKey }).populate(
    "updatedBy",
    "name email"
  );

  const gapSettings = await ExchangeSettings.findOne({ key: "global" }).lean();
  const extraPercentagePointsFromDb =
    gapSettings?.extraPercentagePoints != null &&
    Number.isFinite(gapSettings.extraPercentagePoints)
      ? gapSettings.extraPercentagePoints
      : null;

  let liveRate = null;
  let bcv = null;
  let paralelo = null;
  let usdt = null;
  let gapMarket = null;
  let gapPercent = null;
  let gapPercentMarket = null;
  let extraPercentagePointsUsed = EXTRA_PERCENTAGE_POINTS;
  try {
    const snap = await fetchDolarApiSnapshot();
    bcv = snap.bcv;
    paralelo = snap.paralelo;
    usdt = snap.usdt;
    gapMarket = snap.gapMarket;
    gapPercent = snap.gapPercent;
    gapPercentMarket = snap.gapPercentMarket ?? null;
    extraPercentagePointsUsed =
      snap.extraPercentagePointsUsed ?? EXTRA_PERCENTAGE_POINTS;
    liveRate = snap.liveRate;
  } catch {
    try {
      liveRate = await computeLiveBsFromDolarApi();
    } catch {
      /* optional */
    }
  }

  const effective = await resolveEffectiveBs(dateKey);

  res.json({
    dateKey,
    caracasToday: getCaracasDateKey(),
    extraPercentagePointsFromDb,
    locked: locked
      ? {
          bsPerUsd: locked.bsPerUsd,
          note: locked.note,
          updatedAt: locked.updatedAt,
          updatedBy: locked.updatedBy,
        }
      : null,
    liveRate,
    dolarApi: {
      bcv,
      paralelo,
      usdt,
      gapMarket,
      gapPercent,
      gapPercentMarket,
    },
    effective: {
      rate: effective.rate,
      source: effective.source,
    },
    extraPercentagePoints: extraPercentagePointsUsed,
  });
});

// @route   PUT /api/settings/exchange-rate
// @access  Private/Admin
function parsePositiveBsPerUsd(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value.trim().replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

const upsertDailyExchangeRate = asyncHandler(async (req, res) => {
  const { bsPerUsd: rawBs, dateKey: bodyDateKey, note } = req.body;
  const dateKey =
    typeof bodyDateKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(bodyDateKey)
      ? bodyDateKey
      : getCaracasDateKey();

  const bsPerUsd = parsePositiveBsPerUsd(rawBs);
  if (!Number.isFinite(bsPerUsd) || bsPerUsd <= 0) {
    res.status(400);
    throw new Error("bsPerUsd debe ser un número mayor que 0");
  }

  const doc = await DailyExchangeRate.findOneAndUpdate(
    { dateKey },
    {
      bsPerUsd,
      note: typeof note === "string" ? note : "",
      updatedBy: req.user._id,
    },
    { upsert: true, new: true, runValidators: true }
  );

  await broadcastExchangeRate();

  res.json({
    message: "Tasa guardada",
    dateKey: doc.dateKey,
    bsPerUsd: doc.bsPerUsd,
    note: doc.note,
    updatedAt: doc.updatedAt,
  });
});

// @route   DELETE /api/settings/exchange-rate/:dateKey
// @access  Private/Admin
const deleteDailyExchangeRate = asyncHandler(async (req, res) => {
  const { dateKey } = req.params;
  if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    res.status(400);
    throw new Error("dateKey inválido (use YYYY-MM-DD)");
  }

  const result = await DailyExchangeRate.deleteOne({ dateKey });
  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error("No había tasa fijada para esa fecha");
  }

  await broadcastExchangeRate();

  res.json({ message: "Tasa fijada eliminada; se usará la tasa en vivo (API)", dateKey });
});

// @route   POST /api/settings/exchange-rate/sync-from-live
// @access  Private/Admin
const syncExchangeRateFromLive = asyncHandler(async (req, res) => {
  const dateKey =
    typeof req.body?.dateKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.body.dateKey)
      ? req.body.dateKey
      : getCaracasDateKey();

  let snap;
  try {
    snap = await fetchLiveExchangeSnapshot();
  } catch {
    res.status(503);
    throw new Error("No se pudo obtener la tasa en vivo. Intente más tarde.");
  }

  if (
    snap.liveRate == null ||
    !Number.isFinite(snap.liveRate) ||
    snap.liveRate <= 0
  ) {
    res.status(503);
    throw new Error("Tasa en vivo no disponible (BCV / USDT / paralelo).");
  }

  const doc = await DailyExchangeRate.findOneAndUpdate(
    { dateKey },
    {
      bsPerUsd: snap.liveRate,
      note: "Actualización manual desde tasa en vivo (BCV + USDT + brecha)",
      updatedBy: req.user._id,
    },
    { upsert: true, new: true, runValidators: true }
  );

  await broadcastExchangeRate();

  res.json({
    message: "Tasa fijada con el valor en vivo actual",
    dateKey: doc.dateKey,
    bsPerUsd: doc.bsPerUsd,
    note: doc.note,
    updatedAt: doc.updatedAt,
    liveSnapshot: {
      bcv: snap.bcv,
      usdt: snap.usdt,
      paralelo: snap.paralelo,
      gapMarket: snap.gapMarket,
      gapPercent: snap.gapPercent,
      gapPercentMarket: snap.gapPercentMarket,
      extraPercentagePointsUsed: snap.extraPercentagePointsUsed,
    },
  });
});

function parseExtraPercentagePointsInput(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value.trim().replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

// Si hay tasa fijada para hoy (Caracas), recalcula con la nueva fórmula para que el sitio y PDFs reflejen el cambio.
async function refreshTodaysLockedRateAfterExtraPointsChange() {
  const dateKey = getCaracasDateKey();
  const snap = await fetchLiveExchangeSnapshot();
  if (snap.liveRate == null || !Number.isFinite(snap.liveRate) || snap.liveRate <= 0) {
    return { refreshed: false };
  }
  const result = await DailyExchangeRate.updateOne(
    { dateKey },
    {
      $set: {
        bsPerUsd: snap.liveRate,
        note: "Actualizado: puntos extra (admin)",
      },
    }
  );
  return { refreshed: result.matchedCount > 0 };
}

// @route   PUT /api/settings/exchange-extra-points
// @access  Private/Admin
const updateExchangeExtraPoints = asyncHandler(async (req, res) => {
  const raw = req.body?.extraPercentagePoints;
  if (raw === null || raw === undefined || raw === "") {
    await ExchangeSettings.findOneAndUpdate(
      { key: "global" },
      { $set: { extraPercentagePoints: null } },
      { upsert: true, new: true }
    );
    const { refreshed } = await refreshTodaysLockedRateAfterExtraPointsChange();
    await broadcastExchangeRate();
    return res.json({
      message: `Puntos extra restaurados al predeterminado (${EXTRA_PERCENTAGE_POINTS}%)`,
      extraPercentagePoints: null,
      extraPercentagePointsEffective: EXTRA_PERCENTAGE_POINTS,
      todaysLockedRateRefreshed: refreshed,
    });
  }

  const n = parseExtraPercentagePointsInput(raw);
  if (!Number.isFinite(n)) {
    res.status(400);
    throw new Error("Valor inválido: use un número (ej. 3.5 o 4.5)");
  }
  if (n < 0 || n > 50) {
    res.status(400);
    throw new Error("Los puntos extra deben estar entre 0 y 50");
  }

  const doc = await ExchangeSettings.findOneAndUpdate(
    { key: "global" },
    { $set: { extraPercentagePoints: n } },
    { upsert: true, new: true, runValidators: true }
  );

  const { refreshed } = await refreshTodaysLockedRateAfterExtraPointsChange();

  await broadcastExchangeRate();

  res.json({
    message: "Puntos extra guardados",
    extraPercentagePoints: doc.extraPercentagePoints,
    extraPercentagePointsEffective: doc.extraPercentagePoints,
    todaysLockedRateRefreshed: refreshed,
  });
});

export {
  getPublicExchangeRate,
  getAdminExchangeStatus,
  upsertDailyExchangeRate,
  deleteDailyExchangeRate,
  syncExchangeRateFromLive,
  updateExchangeExtraPoints,
};
