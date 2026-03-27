import { apiSlice } from "./apiSlice";
import { SETTINGS_URL } from "../constants";

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExchangeRateStatus: builder.query({
      query: (dateKey) => ({
        url: `${SETTINGS_URL}/exchange-rate/status`,
        params: dateKey ? { date: dateKey } : undefined,
      }),
      providesTags: () => [{ type: "ExchangeRate", id: "STATUS" }],
    }),
    upsertDailyExchangeRate: builder.mutation({
      query: (body) => ({
        url: `${SETTINGS_URL}/exchange-rate`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "ExchangeRate", id: "STATUS" }],
    }),
    deleteDailyExchangeRate: builder.mutation({
      query: (dateKey) => ({
        url: `${SETTINGS_URL}/exchange-rate/${encodeURIComponent(dateKey)}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ExchangeRate", id: "STATUS" }],
    }),
    syncExchangeRateFromLive: builder.mutation({
      query: (body) => ({
        url: `${SETTINGS_URL}/exchange-rate/sync-from-live`,
        method: "POST",
        body: body ?? {},
      }),
      invalidatesTags: [{ type: "ExchangeRate", id: "STATUS" }],
    }),
    updateExchangeExtraPoints: builder.mutation({
      query: (body) => ({
        url: `${SETTINGS_URL}/exchange-extra-points`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "ExchangeRate", id: "STATUS" }],
    }),
  }),
});

export const {
  useGetExchangeRateStatusQuery,
  useUpsertDailyExchangeRateMutation,
  useDeleteDailyExchangeRateMutation,
  useSyncExchangeRateFromLiveMutation,
  useUpdateExchangeExtraPointsMutation,
} = settingsApiSlice;
