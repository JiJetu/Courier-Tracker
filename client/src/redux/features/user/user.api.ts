import { baseApi } from "../../api/base.api";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerMetrics: builder.query({
      query: () => ({
        url: "/customer/dashboard-metrics",
        method: "GET",
      }),
      providesTags: ["User", "Parcel"],
    }),
    getAgentMetrics: builder.query({
      query: () => ({
        url: "/agent/dashboard-metrics",
        method: "GET",
      }),
      providesTags: ["User", "Parcel"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetCustomerMetricsQuery,
  useGetAgentMetricsQuery,
  useUpdateProfileMutation,
} = userApi;
