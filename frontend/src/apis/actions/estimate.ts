import { baseApi } from "../utils/baseApi";

export const estimateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEstimate: builder.mutation<{ user: any }, any>({
      query: (data) => ({
        url: "/estimate/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Estimates"], // force the refresh of the query
    }),
    generateEstimate: builder.mutation<any, { estimateId: string }>({
      query: ({ estimateId }) => ({
        url: `/estimate/generate-estimate?estimateId=${estimateId}`,
        method: "POST",
        responseHandler: (response: any) => response.blob(),
      }),
      invalidatesTags: ["Estimates"], // force the refresh of the query
    }),
    sendEstimateByEmail: builder.mutation<any, any>({
      query: (id) => ({
        url: `/estimate/send-estimate?id=${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Estimates"], // force the refresh of the query
    }),
    removeInvoice: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/invoice/delete-invoice?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoices"], // force the refresh of the query
    }),
    findAllEstimates: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        search?: string | null;
        status?: string | null;
      }
    >({
      query: ({ page = 1, limit = 10, search = "", status = "" }) => {
        let url = `/estimate/all-estimates?limit=${limit}&page=${page}`;

        if (search) {
          url += `&search=${search}`;
        }
        if (status) {
          url += `&status=${status}`;
        }

        return url;
      },
      providesTags: ["Estimates"],
    }),
  }),
});

export const {
  useCreateEstimateMutation,
  useGenerateEstimateMutation,
  useSendEstimateByEmailMutation,
  useRemoveInvoiceMutation,
  useFindAllEstimatesQuery,
} = estimateApi;
