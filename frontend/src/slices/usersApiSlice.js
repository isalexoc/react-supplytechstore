import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    googleLogin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/google`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
      }),
      providesTags: ["Users"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/subscribe`,
        method: "POST",
        body: data,
      }),
    }),
    checkSubscriber: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/subscribe`,
        body: data,
      }),
    }),
    unsubscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/subscribe?email=${data.email}`,
        method: "DELETE",
      }),
    }),
    contactForm: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/contact`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useSubscribeNewsletterMutation,
  useCheckSubscriberQuery,
  useUnsubscribeNewsletterMutation,
  useContactFormMutation,
} = usersApiSlice;
