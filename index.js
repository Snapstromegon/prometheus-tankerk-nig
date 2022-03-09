import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fastify from "fastify";
import resolveLocationToCoordinates from "./resolveLocationToCoordinates.js";
import loadPrices from "./tankerkoenig.js";

const args = yargs(hideBin(process.argv))
  .env("TANKERKOENIG")
  .option("update-interval", {
    alias: "u",
    default: 5 * 60,
    type: "number",
    description: "Update interval in seconds",
  })
  .option("api-key", {
    alias: "k",
    type: "string",
    description: "Tankerkönig API Key",
  })
  .option("lat", {
    type: "number",
    description: "Latitude of the location",
  })
  .option("lon", {
    type: "number",
    description: "Longitude of the location",
  })
  .option("location", {
    type: "string",
    description: "Location description (instead of lat/lon)",
  })
  .option("rad", {
    alias: "r",
    type: "number",
    default: 10,
    description: "Acceptable radius in km",
  })
  .option("port", {
    alias: "p",
    default: 9501,
    type: "number",
    description: "Port to expose metrics on",
  })
  .option("namespace", {
    alias: "n",
    default: "tankerkoenig",
    type: "string",
    description: "Namespace/prefix for prometheus metrics",
  })
  .option("listen", {
    alias: "i",
    default: "0.0.0.0",
    type: "string",
    description: "Interface to expose metrics on",
  })
  .option("enable-logging", {
    alias: "l",
    type: "boolean",
    description: "If logging should be enabled",
  })
  .parse();

if (args.updateInterval < 300) {
  console.warn(
    "Update interval is less than 5 minutes. Setting to minimum of 5 minutes, to reduce load to Tankerkönig API and to avoid invalidating API key."
  );
  args.updateInterval = 5 * 60;
}

let location;

const loadLocation = async () => {
  if (!location) {
    if (args.location) {
      location = await resolveLocationToCoordinates(args.location);
    } else {
      location = {
        lat: args.lat,
        lon: args.lon,
      };
    }
  }
  return location;
};

let data;
let lastUpdate;

const updatePrices = async () => {
  const location = await loadLocation();

  const prices = await loadPrices({
    location,
    rad: args.rad,
    apiKey: args.apiKey,
  });
  data = prices;
  lastUpdate = Date.now() / 1000;
};
setInterval(updatePrices, args.updateInterval * 1000);
updatePrices();

const app = fastify({ logger: args.enableLogging });

app.get("/metrics", () => {
  return `
# Data provided by https://creativecommons.tankerkoenig.de
${args.namespace}_last_update ${lastUpdate}
${data
  .map(
    (entry) =>
      `${Object.entries(entry.fuelPrices)
        .map(
          ([fuelType, price]) =>
            `${args.namespace}_fuel_price{id="${entry.id}",name="${entry.name}",brand="${entry.brand}",type="${fuelType}"} ${price}`
        )
        .join("\n")}
${args.namespace}_is_open{id="${entry.id}",name="${entry.name}",brand="${
        entry.brand
      }"} ${entry.isOpen ? 1 : 0}
${args.namespace}_distance{id="${entry.id}",name="${entry.name}",brand="${
        entry.brand
      }"} ${entry.dist}`
  )
  .join("\n")}`;
});

app.get("/metrics/json", () => {
  return data;
});

app.get("/", (_, reply) => {
  reply.redirect("/metrics");
});

app.listen(args.port, args.listen, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(address);
});
