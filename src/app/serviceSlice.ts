import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { RootState } from './store';
import {REACT_APP_VIVA_APPLICATION_API_URL} from "../config/config";

export const serviceSlice = createApi({
  reducerPath: 'viva-api',

  baseQuery: fetchBaseQuery({
    baseUrl: REACT_APP_VIVA_APPLICATION_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).authentication.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
