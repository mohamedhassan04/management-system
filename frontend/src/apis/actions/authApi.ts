import { baseApi } from "../utils/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: any }, { email: string; password: string }>(
      {
        query: (credentials) => ({
          url: "/auth/login",
          method: "POST",
          body: credentials,
        }),
        invalidatesTags: ["Auth"],
      }
    ),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => "/auth/current",
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery, useLogoutMutation } =
  authApi;
