export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // save image for each item in cart if images array exists use images[0].url else use image
  state.cartItems = state.cartItems.map((item) => {
    item.image =
      item.images && item.images.length > 0 ? item.images[0].url : item.image;
    return item;
  });

  //Calculate the shipping price (free shipping if items price > 100)
  if (state.shippingMethod === "pickup") {
    state.shippingPrice = 0;
  } else {
    state.shippingPrice = addDecimals(
      state.shippingAddress.city.toString().toLowerCase() === "maracay" ? 2 : 10
    );
  }

  //Calculate the tax price (15% tax)
  state.taxPrice =
    Number(0); /* addDecimals(Number((0.15 * state.itemsPrice).toFixed(2))); */
  //Calculate the total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
