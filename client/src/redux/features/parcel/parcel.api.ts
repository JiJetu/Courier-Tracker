import { baseApi } from "../../api/base.api";

const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createParcel: builder.mutation({
      query: (parcelData) => ({
        url: "/parcel",
        method: "POST",
        body: parcelData,
      }),
      invalidatesTags: ["Parcel"],
    }),

    // Get parcels based on user role
    getMyParcels: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/parcel?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Parcel"],
    }),

    getActiveAssignedParcels: builder.query({
      query: () => ({
        url: "/parcel/assigned-active",
        method: "GET",
      }),
      providesTags: ["Parcel"],
    }),

    // Get single parcel by ID
    getParcelById: builder.query({
      query: (id) => ({
        url: `/parcel/${id}`,
        method: "GET",
      }),
      providesTags: ["Parcel"],
    }),

    updateParcelStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/parcel/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Parcel"],
    }),

    // Assign parcel to agent (admin only)
    assignParcel: builder.mutation({
      query: ({ id, agentId }) => ({
        url: `/parcel/assign/${id}`,
        method: "PATCH",
        body: { agentId },
      }),
      invalidatesTags: ["Parcel"],
    }),

    // Track parcel location (real-time updates)
    updateParcelLocation: builder.mutation({
      query: ({ id, lat, lng }) => ({
        url: `/parcel/track/${id}`,
        method: "PATCH",
        body: { lat, lng },
      }),
      invalidatesTags: ["Parcel"],
    }),
  }),
});

export const {
  useCreateParcelMutation,
  useGetMyParcelsQuery,
  useGetParcelByIdQuery,
  useUpdateParcelStatusMutation,
  useAssignParcelMutation,
  useUpdateParcelLocationMutation,
  useGetActiveAssignedParcelsQuery,
} = parcelApi;
