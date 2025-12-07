import { baseApi } from "../utils/baseApi";

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInvoice: builder.mutation<{ user: any }, any>({
      query: (data) => ({
        url: "/invoice/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invoices"], // force the refresh of the query
    }),
    generateInvoice: builder.mutation<any, { factureId: string }>({
      query: ({ factureId }) => ({
        url: `/invoice/generate-invoice?factureId=${factureId}`,
        method: "POST",
        responseHandler: (response: any) => response.blob(),
      }),
      invalidatesTags: ["Invoices"], // force the refresh of the query
    }),
    sendReminderPaymentEmail: builder.mutation<any, any>({
      query: (id) => ({
        url: `/invoice/send-reminder?id=${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Invoices"], // force the refresh of the query
    }),
    // removeClient: builder.mutation<any, { id: string }>({
    //   query: ({ id }) => ({
    //     url: `/clients/remove-client?id=${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Clients"], // force the refresh of the query
    // }),
    findAllInvoices: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        search?: string | null;
        status?: string | null;
      }
    >({
      query: ({ page = 1, limit = 10, search = "", status = "" }) => {
        let url = `/invoice/all-invoices?limit=${limit}&page=${page}`;

        if (search) {
          url += `&search=${search}`;
        }
        if (status) {
          url += `&status=${status}`;
        }

        return url;
      },
      providesTags: ["Invoices"],
    }),
  }),
});

export const {
  useFindAllInvoicesQuery,
  useGenerateInvoiceMutation,
  useCreateInvoiceMutation,
  useSendReminderPaymentEmailMutation,
} = invoiceApi;
