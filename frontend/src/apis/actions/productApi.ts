import { baseApi } from "../utils/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<any, any>({
      query: (product) => ({
        url: "/product/create",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"], // force the refresh of the query
    }),
    updateProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/product/update-product?id=${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"], // force the refresh of the query
    }),
    // updateStatusClient: builder.mutation<any, { id: string; data: any }>({
    //   query: ({ id, data }) => ({
    //     url: `/clients/update-status?id=${id}`,
    //     method: "PATCH",
    //     body: data,
    //   }),
    //   invalidatesTags: ["Clients"], // force the refresh of the query
    // }),
    removeProduct: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/product/delete-product?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"], // force the refresh of the query
    }),
    findAllProducts: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        category?: string | null;
        status?: string | null;
        search?: string | null;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        category = "",
        status = "",
        search = "",
      }) => {
        let url = `/product/all-products?limit=${limit}&page=${page}`;

        if (category) {
          url += `&category=${category}`;
        }
        if (status) {
          url += `&status=${status}`;
        }
        if (search) {
          url += `&search=${search}`;
        }

        return url;
      },
      providesTags: ["Products"],
    }),
    findAllCategories: builder.query<any, void>({
      query: () => ({
        url: "/categories/find-all",
      }),
      providesTags: ["Categories"],
    }),
    findAllSuplliers: builder.query<any, void>({
      query: () => ({
        url: "/supllier/find-all",
      }),
      providesTags: ["Suppliers"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useRemoveProductMutation,
  useFindAllProductsQuery,
  useFindAllCategoriesQuery,
  useFindAllSuplliersQuery,
} = productApi;
