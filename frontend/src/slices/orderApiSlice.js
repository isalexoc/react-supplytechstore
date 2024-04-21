import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL, UPLOAD_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: ({ pageNumber }) => ({
        url: ORDERS_URL,
        params: { pageNumber },
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
    ChangePay: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/changePay`,
        method: "PUT",
        body: data,
      }),
    }),
    uploadPaymentCapture: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/uploadzelle`,
        method: "POST",
        body: data,
      }),
    }),
    updateOrderZelle: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/updateOrderZelle`,
        method: "PUT",
        body: data,
      }),
    }),
    markAsPaid: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/markAsPaid`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useChangePayMutation,
  useUploadPaymentCaptureMutation,
  useUpdateOrderZelleMutation,
  useMarkAsPaidMutation,
  useGeneratePdfMutation,
} = orderApiSlice;
