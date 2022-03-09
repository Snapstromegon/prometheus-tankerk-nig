import { fetch } from "undici";

export const POSSIBLE_FUEL_TYPES = ["e5", "e10", "diesel"];

export const loadPrices = async ({ location: { lon, lat }, rad, apiKey }) => {
  const resp = await fetch(
    `https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${lon}&rad=${rad}&type=all&apikey=${apiKey}`
  );
  if (!resp.ok) {
    throw new Error("Request to Tankerkönig failed");
  }
  const result = await resp.json();
  if (!result.ok) {
    console.error(result);
    throw new Error("Tankerkönig returned error");
  }
  return result.stations.map((station) => ({
    id: station.id,
    name: station.name,
    brand: station.name,
    fuelPrices: {
      diesel: station.diesel,
      e5: station.e5,
      e10: station.e10,
    },
    isOpen: station.isOpen,
    dist: station.dist,
  }));
};

export default loadPrices;
