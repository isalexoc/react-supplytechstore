const getDollarPrice = async () => {
  const response = await fetch(
    "https://pydolarve.org/api/v1/dollar?page=dolartoday"
  );
  const data = await response.json();
  const dollar = data?.monitors?.dolar_today?.price;
  return dollar;
};

export default getDollarPrice;
