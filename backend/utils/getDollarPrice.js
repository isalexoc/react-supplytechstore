import { resolveEffectiveBs } from "./resolveEffectiveExchangeRate.js";

/**
 * Bs per USD for PDF/catalog: locked daily rate (Caracas date) if set, else live DolarApi formula.
 * @returns {Promise<number|null>}
 */
const getDollarPrice = async () => {
  try {
    const { rate } = await resolveEffectiveBs();
    return rate;
  } catch (error) {
    console.error("Error resolving dollar price:", error.message);
    return null;
  }
};

export default getDollarPrice;
