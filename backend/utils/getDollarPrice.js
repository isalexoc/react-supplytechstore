const getDollarPrice = async () => {
  try {
    const response = await fetch(
      "https://pydolarve.org/api/v1/dollar?page=dolartoday"
    );

    // Check if the response is successful (status code 2xx)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try to parse the response as JSON
    const data = await response.json();

    // Check if the expected data structure exists
    const dollar = data?.monitors?.dolartoday?.price;

    if (!dollar) {
      throw new Error("Dollar price data not found in the API response");
    }

    return dollar;
  } catch (error) {
    console.error("Error fetching dollar price:", error.message);

    // You can return a default value or handle the error as needed
    return null; // Return null or some fallback value when there's an error
  }
};

export default getDollarPrice;
