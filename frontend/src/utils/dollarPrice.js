import { BASE_URL } from "../constants";

/**
 * Bs per USD: locked daily rate from API if set for today (Caracas), else live formula on server.
 * @returns {Promise<number>}
 */
const getDollarPrice = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/settings/exchange-rate`, {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const rate = data.rate;
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) return 0;
    return rate;
  } catch {
    return 0;
  }
};

export default getDollarPrice;
