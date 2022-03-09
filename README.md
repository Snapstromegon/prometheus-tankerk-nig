# Tankerkoenig-Prometheus

This is a prometheus exporter for the german fuel price API [Tankerkönig](https://creativecommons.tankerkoenig.de/).

## Usage

To use this tool, just start the tool via `npm start -- [options]` or run the docker container via `docker run -p 9501:9501 snapstromegon/tankerkoenig-prometheus [options]`.

You can configure the tool via these options:

| Option            | Shortcut | Environment Variable         | Type    | Description                                                       | Default         |
| :---------------- | :------- | :--------------------------- | :------ | :---------------------------------------------------------------- | :-------------- |
| --update-interval | -u       | TANKERKOENIG_UPDATE_INTERVAL | number  | Update interval in seconds                                        | 300 (5 minutes) |
| --api-key         | -k       | TANKERKOENIG_API_KEY         | string  | Tankerkönig API Key                                               | -               |
| --lat             | -        | TANKERKOENIG_LAT             | number  | Latitude of the current location                                  | -               |
| --lon             | -        | TANKERKOENIG_LON             | number  | Longitude of the current location                                 | -               |
| --location        | -        | TANKERKOENIG_LOCATION        | string  | Text description of the current location (overwrites lat and lon) | -               |
| --rad             | -r       | TANKERKOENIG_RAD             | number  | Radius around location in km to include in search (max. 25)       | -               |
| --port            | -p       | TANKERKOENIG_PORT            | number  | Port to listen on                                                 | 9501            |
| --namespace       | -n       | TANKERKOENIG_NAMESPACE       | string  | Namespace/prefix for prometheus metrics                           | tankerkoenig    |
| --listen          | -i       | TANKERKOENIG_LISTEN          | string  | Interface to listen on                                            | 0.0.0.0         |
| --enable-logging  | -l       | TANKERKOENIG_ENABLE_LOGGING  | boolean | Enable more detailed logging                                      | false           |

## Get an API Key

To get an API key, follow the guide on the [Tankerkönig page](https://creativecommons.tankerkoenig.de/).

## Location resolver

To resolve the location of the `--location` option, the [Open Street Maps Nominatim service](https://nominatim.openstreetmap.org/) is used.

## Contributions

Feel free to contribute in any shape or form to this project!
