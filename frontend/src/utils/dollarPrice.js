const DOLARAPI_URL = "https://ve.dolarapi.com/v1/dolares";

/** Prefer parallel rate (DolarToday–style); else first valid promedio. */
function extractParaleloPromedio(data) {
  const list = Array.isArray(data) ? data : [];
  const paralelo = list.find(
    (r) =>
      r?.fuente === "paralelo" &&
      typeof r?.promedio === "number" &&
      Number.isFinite(r.promedio)
  );
  if (paralelo) return paralelo.promedio;
  const byName = list.find(
    (r) =>
      /paralelo|dolartoday/i.test(String(r?.nombre ?? "")) &&
      typeof r?.promedio === "number" &&
      Number.isFinite(r.promedio)
  );
  if (byName) return byName.promedio;
  const first = list.find(
    (r) =>
      typeof r?.promedio === "number" && Number.isFinite(r.promedio)
  );
  return first?.promedio ?? null;
}

/**
 * @returns {Promise<number>} Bs/USD rate, or 0 if unavailable (UI hides Bs. when 0)
 */
const getDollarPrice = async () => {
  try {
    const response = await fetch(DOLARAPI_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const dollar = extractParaleloPromedio(data);
    if (dollar == null) {
      throw new Error("No parallel dollar rate in API response");
    }
    return dollar;
  } catch (error) {
    console.warn("DolarApi:", error.message);
    return 0;
  }
};

export default getDollarPrice;
