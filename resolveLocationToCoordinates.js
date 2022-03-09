import { fetch } from "undici";

const resolveLocationToCoordinate = async (query) => {
  const resp = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json`
  );
  if (!resp.ok) {
    throw new Error("Failed to load location!");
  }
  const result = await resp.json();
  if (!result) {
    throw new Error(`Unable to find location: ${query}`);
  }
  const { lat, lon } = result[0];
  return { lat, lon };
};
export default resolveLocationToCoordinate;
