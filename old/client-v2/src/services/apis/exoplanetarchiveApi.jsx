import axios from "axios";

const EARTH_CONSTANTS = {
  radius: 1.0, // In Earth radii
  density: 5.51, // In g/cm^3
  escapeVelocity: 11.186, // In km/s
  equilibriumTemp: 255.0, // In Kelvin
};

const getPropertyEsi = (value, reference) => {
  return 1 - Math.abs((value - reference) / (value + reference));
};

const axiosInstance = axios.create({
  baseURL:
    "https://corsproxy.io/?url=https://exoplanetarchive.ipac.caltech.edu/TAP/",
  withCredentials: false,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

const queryBuilder = (from = 0, to = 30, search = null) => {
  // return `sync?query=SELECT pl_name, discoverymethod, pl_rade, pl_masse, pl_eqt, sy_dist, disc_year, pl_orbper, pl_orbsmax, pl_orbeccen, pl_dens FROM ps ${
  //   search ? `${search}` : ""
  // }
  // TOP ${to}
  // &format=json`;
  return `sync?query=SELECT \
  pl_name, hostname, discoverymethod, pl_rade, pl_masse, pl_eqt, sy_dist, disc_year, pl_orbper, pl_orbsmax, pl_orbeccen, pl_dens \
  FROM ( \
    SELECT t.*, ROWNUM AS rnum FROM ( \
      SELECT \
      pl_name, hostname, discoverymethod, pl_rade, pl_masse, pl_eqt, sy_dist, disc_year, pl_orbper, pl_orbsmax, pl_orbeccen, pl_dens \
      FROM ps \
      ORDER BY pl_name \
    ) t WHERE ROWNUM <= ${to} \
    ${search ? ` and ${search}` : ""} \
  ) WHERE rnum > ${from} \
    ${search ? ` and ${search}` : ""} \
  &format=json`;
};

const processData = (data) => {
  data.forEach((planet) => {
    switch (true) {
      case planet.pl_rade > 6:
        planet.type = "Gas Giant";
        break;
      case planet.pl_rade > 2 && planet.pl_rade < 6:
        planet.type = "Ice Giant";
        break;
      case planet.pl_rade > 1.25 && planet.pl_rade < 2:
        planet.type = "Super Earth";
        break;
      default:
        planet.type = "Terrestrial";
    }
    if (!planet.pl_masse) {
      planet.pl_masse = 0;
    }
    if (!planet.pl_eqt) {
      planet.pl_eqt = 0;
    }
    if (!planet.sy_dist) {
      planet.sy_dist = 0;
    }
    if (!planet.pl_rade) {
      planet.pl_rade = 0;
    }
    if (!planet.disc_year) {
      planet.disc_year = 0;
    }
    if (planet.pl_rade < 1.6 && planet.sy_dist) {
      planet.habitable = true;
    } else {
      planet.habitable = false;
    }
    if (
      planet.pl_rade &&
      planet.pl_dens &&
      planet.pl_masse &&
      planet.pl_eqt &&
      planet.pl_rade > 0.5 &&
      planet.pl_rade < 1.6 &&
      planet.pl_dens > 3.0 &&
      planet.pl_dens < 8.0
    ) {
      // 1. Calculate Escape Velocity relative to Earth
      const escapeVelocity =
        EARTH_CONSTANTS.escapeVelocity *
        Math.sqrt(planet.pl_masse / planet.pl_rade);

      // 2. Calculate individual ESI for each property
      const esi_radius = getPropertyEsi(planet.pl_rade, EARTH_CONSTANTS.radius);
      const esi_density = getPropertyEsi(
        planet.pl_dens,
        EARTH_CONSTANTS.density
      );
      const esi_vescape = getPropertyEsi(
        escapeVelocity,
        EARTH_CONSTANTS.escapeVelocity
      );
      const esi_temp = getPropertyEsi(
        planet.pl_eqt,
        EARTH_CONSTANTS.equilibriumTemp
      );

      // 3. Calculate final ESI score (geometric mean)
      const esi_score = Math.pow(
        esi_radius * esi_density * esi_vescape * esi_temp,
        0.25
      );
      planet.esiScore = esi_score;
    }
  });
};

export const getExoplanets = async (from = 0, to = 30, search = null) => {
  try {
    const response = await axiosInstance.get(queryBuilder(from, to, search));
    processData(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exoplanets:", error);
    throw error;
  }
};
