function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calcPrices(orderItems, city, shippingMethod) {
  // Calculate the items price
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const cityLowerCased = city.toString().toLowerCase();
  let isMaracay = false;
  if (cityLowerCased === "maracay") {
    isMaracay = true;
  }
  // Calculate the shipping price
  let shippingPrice;
  if (shippingMethod === "pickup") {
    shippingPrice = 0;
  } else {
    shippingPrice = isMaracay ? 2 : 10;
  }

  // Calculate the tax price
  const taxPrice =
    Number(0); /* addDecimals(Number((0.15 * state.itemsPrice).toFixed(2))); */
  // Calculate the total price
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
