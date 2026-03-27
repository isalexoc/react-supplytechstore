import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setExchangeRate } from "../slices/exchangeRateSlice";
import getDollarPrice from "../utils/dollarPrice";
import { SOCKET_URL } from "../constants";

const ExchangeRateSocketListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getDollarPrice().then((rate) => {
      if (rate != null && Number.isFinite(rate)) {
        dispatch(setExchangeRate({ rate }));
      }
    });

    const baseUrl =
      SOCKET_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const socket = io(baseUrl, {
      path: "/socket.io/",
      transports: ["websocket", "polling"],
    });

    socket.on("exchangeRate", (payload) => {
      if (payload?.rate != null && Number.isFinite(payload.rate)) {
        dispatch(
          setExchangeRate({
            rate: payload.rate,
            source: payload.source,
            dateKey: payload.dateKey,
          })
        );
      }
    });

    socket.on("connect_error", (err) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("[socket] exchange rate:", err.message);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return null;
};

export default ExchangeRateSocketListener;
