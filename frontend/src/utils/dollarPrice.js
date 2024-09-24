const getDollarPrice = async () => {
  const response = await fetch(
    "https://pydolarve.org/api/v1/dollar?page=dolartoday"
  );
  const data = await response.json();
  const dollar = data?.monitors?.dolartoday?.price;
  return dollar;
};

export default getDollarPrice;
