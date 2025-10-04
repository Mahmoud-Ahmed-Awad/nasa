import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaGlobe,
  FaThermometerHalf,
  FaWeight,
  FaCalendarAlt,
  FaEye,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";
import { genDescription } from "../services/gemini";
import Markdown from "react-markdown";
import { getExoplanets } from "../services/apis/exoplanetarchiveApi";

const ExoplanetTable = ({ exoplanets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterType, setFilterType] = useState("all");
  const [filterHabitable, setFilterHabitable] = useState("all");
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedPlanetDescription, setSelectedPlanetDescription] =
    useState(null);
  const [remotePlanets, setRemotePlanets] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchDebounceRef = useRef(null);

  // Fetch from API when searching (debounced)
  useEffect(() => {
    // Clear previous debounce
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const term = (searchTerm || "").trim();

    if (!term) {
      // Reset to use parent-provided data
      setRemotePlanets([]);
      setSearching(false);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        setSearching(true);
        const upper = term.toUpperCase();
        const safeUpper = upper.replace(/'/g, "''");
        const condition = `( \
          pl_name LIKE '%${safeUpper}%' \
          OR hostname LIKE '%${safeUpper}%' \
          OR discoverymethod LIKE '%${safeUpper}%' \
        )`;
        const results = await getExoplanets(0, 60, condition);
        setRemotePlanets(results || []);
      } catch (e) {
        console.error("Search fetch failed", e);
        setRemotePlanets([]);
      } finally {
        setSearching(false);
      }
    }, 400); // debounce 400ms

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchTerm]);

  // Filter and sort exoplanets
  const filteredAndSortedPlanets = useMemo(() => {
    const basePlanets = searchTerm ? remotePlanets : exoplanets;
    let filtered = basePlanets.filter((planet) => {
      const matchesSearch =
        planet.pl_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        planet.discoverymethod
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        planet.hostname.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || planet.type === filterType;
      const matchesHabitable =
        filterHabitable === "all" ||
        (filterHabitable === "habitable" && planet.habitable) ||
        (filterHabitable === "non-habitable" && !planet.habitable);

      return matchesSearch && matchesType && matchesHabitable;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle numeric values
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      aValue = aValue?.toString().toLowerCase() || "";
      bValue = bValue?.toString().toLowerCase() || "";

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [
    exoplanets,
    remotePlanets,
    searchTerm,
    sortField,
    sortDirection,
    filterType,
    filterHabitable,
  ]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <FaSort className="text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <FaSortUp className="text-neon-blue" />
    ) : (
      <FaSortDown className="text-neon-blue" />
    );
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "gas giant":
        return "text-orange-400 bg-orange-400/10 border-orange-400/30";
      case "super earth":
        return "text-neon-green bg-neon-green/10 border-neon-green/30";
      case "terrestrial":
        return "text-neon-blue bg-neon-blue/10 border-neon-blue/30";
      case "ice giant":
        return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  const generatePlanetDescription = async (planet) => {
    const description = await genDescription(planet);
    setSelectedPlanetDescription(description);
  };

  const getTemperatureColor = (temp) => {
    if (temp < 0) return "text-blue-400";
    if (temp < 20) return "text-cyan-400";
    if (temp < 50) return "text-neon-green";
    if (temp < 100) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
            <input
              type="text"
              placeholder="Search exoplanets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-[30px_!important] pr-4 py-3 form-input focus:border-neon-blue focus:shadow-neon"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-input"
          >
            <option value="all">All Types</option>
            <option value="Gas Giant">Gas Giant</option>
            <option value="Super Earth">Super Earth</option>
            <option value="Terrestrial">Terrestrial</option>
            <option value="Ice Giant">Ice Giant</option>
          </select>

          {/* Habitability Filter */}
          <select
            value={filterHabitable}
            onChange={(e) => setFilterHabitable(e.target.value)}
            className="form-input"
          >
            <option value="all">All Planets</option>
            <option value="habitable">Potentially Habitable</option>
            <option value="non-habitable">Non-Habitable</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center">
            <span className="text-neon-blue font-medium">
              {filteredAndSortedPlanets.length} planets found
            </span>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="table-container"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th
                  className="cursor-pointer hover:bg-neon-blue/5 transition-colors duration-300"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-2">
                    <FaGlobe className="text-neon-blue" />
                    <span>Name</span>
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-neon-blue/5 transition-colors duration-300"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Type</span>
                    {getSortIcon("type")}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-neon-blue/5 transition-colors duration-300"
                  onClick={() => handleSort("mass")}
                >
                  <div className="flex items-center space-x-2">
                    <FaWeight className="text-neon-green" />
                    <span>Mass (Earth)</span>
                    {getSortIcon("mass")}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-neon-blue/5 transition-colors duration-300"
                  onClick={() => handleSort("temperature")}
                >
                  <div className="flex items-center space-x-2">
                    <FaThermometerHalf className="text-red-400" />
                    <span>Temperature (°C)</span>
                    {getSortIcon("temperature")}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-neon-blue/5 transition-colors duration-300"
                  onClick={() => handleSort("distance")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Distance (ly)</span>
                    {getSortIcon("distance")}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-neon-blue/5 transition-colors duration-300"
                  onClick={() => handleSort("discoveryYear")}
                >
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-neon-purple" />
                    <span>Discovered</span>
                    {getSortIcon("discoveryYear")}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAndSortedPlanets.map((planet, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-neon-blue/5 transition-colors duration-300"
                  >
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                          <FaGlobe className="text-white text-sm" />
                        </div>
                        <div>
                          <div className="font-medium text-star-white">
                            {planet.pl_name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {planet.hostname || planet.star}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                          planet.type
                        )}`}
                      >
                        {planet.type}
                      </span>
                    </td>
                    <td>
                      <span className="text-neon-green font-medium">
                        {planet.pl_masse == 0
                          ? "Unkown "
                          : planet.pl_masse.toFixed(2)}
                        x
                      </span>
                    </td>
                    <td>
                      <span
                        className={`font-medium ${getTemperatureColor(
                          planet.pl_eqt || "Unknown"
                        )}`}
                      >
                        {planet.pl_eqt || "Unknown"}°K
                      </span>
                    </td>
                    <td>
                      <span className="text-neon-blue font-medium">
                        {planet.sy_dist.toFixed(1)} ly
                      </span>
                    </td>
                    <td>
                      <span className="text-neon-purple font-medium">
                        {planet.disc_year}
                      </span>
                    </td>
                    <td>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedPlanet(planet);
                          generatePlanetDescription(planet);
                        }}
                        className="p-2 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 rounded-lg text-neon-blue hover:text-white transition-all duration-300"
                      >
                        <FaEye className="text-sm" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Planet Detail Modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedPlanet(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-content max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-space font-bold text-gradient">
                    {selectedPlanet.pl_name}
                  </h2>
                  <button
                    onClick={() => setSelectedPlanet(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neon-blue mb-2">
                        Basic Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-star-white">
                            {selectedPlanet.type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mass:</span>
                          <span className="text-neon-green">
                            {selectedPlanet.pl_masse == 0
                              ? "Unkown "
                              : selectedPlanet.pl_masse.toFixed(2)}
                            Earth masses
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Radius:</span>
                          <span className="text-neon-blue">
                            {selectedPlanet.pl_rade == 0
                              ? "Unkown "
                              : selectedPlanet.pl_rade.toFixed(2)}
                            Earth radii
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Temperature:</span>
                          <span
                            className={getTemperatureColor(
                              selectedPlanet.pl_eqt
                            )}
                          >
                            {selectedPlanet.pl_eqt == 0
                              ? "Unkown "
                              : selectedPlanet.pl_eqt.toFixed(2)}
                            °C
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-neon-blue mb-2">
                        Discovery Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Discovery Year:</span>
                          <span className="text-neon-purple">
                            {selectedPlanet.disc_year}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Discovery Method:
                          </span>
                          <span className="text-star-white">
                            {selectedPlanet.discoverymethod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Distance:</span>
                          <span className="text-neon-blue">
                            {selectedPlanet.sy_dist.toFixed(1)} light years
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neon-blue mb-2">
                        Orbital Characteristics
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Orbital Period:</span>
                          <span className="text-star-white">
                            {selectedPlanet.pl_orbper} days
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Semi-major Axis:
                          </span>
                          <span className="text-neon-green">
                            {selectedPlanet.pl_orbsmax || "Unkown"} AU
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Eccentricity:</span>
                          <span className="text-neon-purple">
                            {selectedPlanet.pl_orbeccen || "Unkown"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-neon-blue mb-2">
                        Habitability
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Potentially Habitable:
                          </span>
                          <span
                            className={
                              selectedPlanet.habitable
                                ? "text-neon-green"
                                : "text-red-400"
                            }
                          >
                            {selectedPlanet.habitable ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ESI Score:</span>
                          <span className="text-neon-blue">
                            {selectedPlanet.esiScore || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-space-gray/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-neon-blue mb-2">
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedPlanetDescription ? (
                      <Markdown>{selectedPlanetDescription}</Markdown>
                    ) : (
                      <FaSpinner className="animate-spin w-10 h-10" />
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExoplanetTable;
