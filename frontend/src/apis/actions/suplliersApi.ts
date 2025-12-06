import { baseApi } from "../utils/baseApi";

export const supllierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupllier: builder.mutation<{ user: any }, any>({
      query: (data) => ({
        url: "/supllier/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Suppliers"], // force the refresh of the query
    }),
    updateSupllier: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/supllier/update-supllier?id=${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Suppliers"], // force the refresh of the query
    }),
    removeSupllier: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/supllier/remove-supllier?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Suppliers"], // force the refresh of the query
    }),
    findAllSuplliersSearch: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        status?: string | null;
        search?: string | null;
      }
    >({
      query: ({ page = 1, limit = 10, status = "", search = "" }) => {
        let url = `/supllier/all-supllier-by-query?limit=${limit}&page=${page}`;

        if (status) {
          url += `&status=${status}`;
        }
        if (search) {
          url += `&search=${search}`;
        }

        return url;
      },
      providesTags: ["Suppliers"],
    }),
  }),
});

export const {
  useCreateSupllierMutation,
  useUpdateSupllierMutation,
  useRemoveSupllierMutation,
  useFindAllSuplliersSearchQuery,
} = supllierApi;
