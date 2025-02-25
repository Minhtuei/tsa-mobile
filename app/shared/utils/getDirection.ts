const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox';

export async function getDirection(from: number[], to: number[]) {
  const response = await fetch(
    `${BASE_URL}/walking/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&continue_straight=true&geometries=geojson&language=vi&overview=full&steps=true&access_token=${process.env.EXPO_MAPBOX_ACCESS_TOKEN || ''}`
  );
  const json = await response.json();
  return json;
}

export const formatDistance = (distance: string) => {
  return `${(parseInt(distance) / 1000).toFixed(2)} km`;
};
