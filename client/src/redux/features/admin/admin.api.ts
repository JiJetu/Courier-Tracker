import { baseApi } from "../../api/base.api";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAgents: builder.query({
      query: () => ({
        url: "/admin/agents",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetAllAgentsQuery } = adminApi;
