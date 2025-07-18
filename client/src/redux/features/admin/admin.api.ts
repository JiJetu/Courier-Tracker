import { baseApi } from "../../api/base.api";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMetrics: builder.query({
      query: () => ({
        url: "/admin/dashboard-metrics",
        method: "GET",
      }),
      providesTags: ["User", "Parcel"],
    }),
    getAllAgents: builder.query({
      query: () => ({
        url: "/admin/agents",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, isBlocked }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body: isBlocked,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllAgentsQuery,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useGetAdminMetricsQuery,
} = adminApi;
