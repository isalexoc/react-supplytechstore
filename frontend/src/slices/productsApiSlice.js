import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
    }),
    getProductByCategory: builder.query({
      query: ({ category, pageNumber }) => ({
        url: `${PRODUCTS_URL}/category`,
        params: {
          category,
          pageNumber,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateDatabaseImages: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/updateImages`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    uploadProductImages: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/uploadmultiple`,
        method: "POST",
        body: data,
      }),
    }),
    deleteImages: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/removeImages`,
        method: "POST",
        body: data,
      }),
    }),
    deleteSingleImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/removeSingleImage`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      providesTags: ["Products"],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/allproducts`,
      }),
      providesTags: ["Products"],
    }),
    getCategories: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/categories`,
      }),
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/categories`,
        method: "POST",
        body: data,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${PRODUCTS_URL}/categories/${categoryId}`,
        method: "DELETE",
      }),
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/categories/${data.categoryId}`,
        method: "PUT",
        body: data,
      }),
    }),
    getCatalog: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}/getcatalog`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByCategoryQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useUpdateDatabaseImagesMutation,
  useDeleteImagesMutation,
  useDeleteSingleImageMutation,
  useUploadProductImagesMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetAllProductsQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useGetCatalogMutation,
} = productsApiSlice;
