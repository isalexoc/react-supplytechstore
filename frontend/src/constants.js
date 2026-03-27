//export const BASE_URL =
//  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";
export const BASE_URL = "";
export const PRODUCTS_URL = "/api/products";
export const USERS_URL = "/api/users";
export const ORDERS_URL = "/api/orders";
export const PAYPAL_URL = "/api/config/paypal";
export const UPLOAD_URL = "/api/upload";
export const SETTINGS_URL = "/api/settings";

/** Socket.io base URL. Empty = same origin as the page (production). Dev defaults to API port. */
export const SOCKET_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_SOCKET_URL || "http://localhost:5000"
    : process.env.REACT_APP_SOCKET_URL || "";
