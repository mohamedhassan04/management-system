import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    window.location.href = "/";
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Clients",
    "Products",
    "Invoices",
    "Categories",
    "Suppliers",
  ],
  endpoints: () => ({}),
});
