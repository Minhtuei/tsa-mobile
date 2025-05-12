import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const mapboxApi = createApi({
  tagTypes: ['Direction'],
  reducerPath: 'mapboxApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.mapbox.com/directions/v5/mapbox' }),
  endpoints: (builder) => ({
    getDirection: builder.query<
      | {
          coordinates: Coordinate[] | undefined;
          distance: string | undefined;
        }
      | undefined,
      {
        from: Coordinate;
        to: Coordinate;
      }
    >({
      query: ({ from, to }) =>
        `/walking/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&continue_straight=true&geometries=geojson&language=vi&overview=full&steps=true&access_token=${process.env.EXPO_MAPBOX_ACCESS_TOKEN || ''}`,
      transformResponse: (response: any) => {
        const route = response?.routes?.[0];
        if (!route?.geometry || typeof route.distance !== 'number') {
          return {
            coordinates: undefined,
            distance: undefined
          };
        }
        return {
          coordinates: route.geometry.coordinates,
          distance: route.distance.toString()
        };
      },
      providesTags: (result, error, arg) => {
        if (error || !arg?.from || !arg?.to) {
          return [{ type: 'Direction' }];
        }
        return [
          { type: 'Direction', id: 'LIST' },
          { type: 'Direction', id: arg.from.join(',') },
          { type: 'Direction', id: arg.to.join(',') }
        ];
      }
    })
  })
});

export const { useLazyGetDirectionQuery } = mapboxApi;
export default mapboxApi;
