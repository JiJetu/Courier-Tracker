import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
} from "@reduxjs/toolkit/query";
import axios from "axios";
import { logout, setUser } from "../features/auth/auth.slice";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        {},
        { withCredentials: true }
      );
      console.log("Backend logout called due to 403");
    } catch (logoutErr) {
      console.error("Backend logout error:", logoutErr);
      toast.error("Something went wrong!!", { duration: 2000 });
    }

    api.dispatch(logout());
  }

  if (result.error?.status === 401) {
    console.log("sending refresh token");
    // fetch refresh token
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );

    const data = res?.data;
    console.log("refresh token", data);

    if (data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      // setting refresh token in local storage
      api.dispatch(setUser({ user, token: data?.accessToken }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["User", "Parcel"],
  endpoints: () => ({}),
});
