const DOLARAPI_URL = "https://ve.dolarapi.com/v1/dolares";

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

const getDollarPrice = async () => {
  try {
    const response = await fetch(DOLARAPI_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const dollar = extractParaleloPromedio(data);
    if (dollar == null) {
      throw new Error("Dollar price data not found in the API response");
    }
    return dollar;
  } catch (error) {
    console.error("Error fetching dollar price:", error.message);
    return null;
  }
};

export default getDollarPrice;
