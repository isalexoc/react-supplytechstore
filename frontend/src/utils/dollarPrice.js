const getDollarPrice = async () => {
  const response = await fetch(
    "https://pydolarvenezuela-api.vercel.app/api/v1/dollar"
  );
  const data = await response.json();
  const dollar = data?.monitors?.dolar_today?.price;
  return dollar;
};

export default getDollarPrice;
