import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const mapboxApi = createApi({
  reducerPath: 'mapboxApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.mapbox.com/directions/v5/mapbox' }),
  endpoints: (builder) => ({
    getDirection: builder.query({
      query: ({ from, to }) =>
        `/walking/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&continue_straight=true&geometries=geojson&language=vi&overview=full&steps=true&access_token=${process.env.EXPO_MAPBOX_ACCESS_TOKEN || ''}`
    })
  })
});

export const { useGetDirectionQuery } = mapboxApi;
export default mapboxApi;
