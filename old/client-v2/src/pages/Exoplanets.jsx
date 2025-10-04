import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGlobe,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaThermometerHalf,
  FaWeight,
  FaCalendarAlt,
  FaEye,
  FaDownload,
  FaShare,
  FaSpinner,
} from "react-icons/fa";
import ExoplanetTable from "../components/ExoplanetTable";
import ChartComponent, {
  ExoplanetTypeChart,
  TemperatureChart,
  MassComparisonChart,
  DiscoveryMethodChart,
} from "../components/ChartComponent";
import MapComponent from "../components/MapComponent";
import { getExoplanets } from "../services/apis/exoplanetarchiveApi";

const Exoplanets = () => {
  const [exoplanets, setExoplanets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGettingMore, setIsGettingMore] = useState(false);
  const [selectedChart, setSelectedChart] = useState("type");
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setExoplanets([]);
    setCurrentPage(1);
    getExoplanetsData(true);
  };

  const getExoplanetsData = async (isSearch = false) => {
    try {
      const response = await getExoplanets(
        (currentPage - 1) * 30,
        currentPage * 30
      );
      setExoplanets((prev) => [...prev, ...response]);
      setIsLoading(false);
      if (isGettingMore) {
        setIsGettingMore(false);
      }
    } catch (error) {
      console.error("Error fetching exoplanets:", error);
      throw error;
    }
  };

  useEffect(() => {
    getExoplanetsData();
  }, [currentPage]);

  const chartOptions = [
    {
      value: "type",
      label: "Type Distribution",
      component: ExoplanetTypeChart,
    },
    {
      value: "temperature",
      label: "Temperature Analysis",
      component: TemperatureChart,
    },
    { value: "mass", label: "Mass Comparison", component: MassComparisonChart },
    {
      value: "discovery",
      label: "Discovery Methods",
      component: DiscoveryMethodChart,
    },
  ];

  const SelectedChartComponent = chartOptions.find(
    (option) => option.value === selectedChart
  )?.component;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-blue text-lg">Loading exoplanets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-space font-bold text-gradient mb-4">
            Exoplanet Database
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Explore thousands of discovered exoplanets beyond our solar system.
            Search, filter, and analyze data about these distant worlds.
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exoplanets by name..."
                className="w-full px-6 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-neon-blue text-gray-900 p-2 rounded-full focus:outline-none hover:bg-opacity-90 transition-all"
                disabled={isLoading}
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 text-center">
            <FaGlobe className="text-3xl text-neon-blue mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {exoplanets.length}
            </h3>
            <p className="text-gray-300">Total Exoplanets</p>
          </div>

          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-green/20 rounded-xl p-6 text-center">
            <FaThermometerHalf className="text-3xl text-neon-green mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {exoplanets.filter((p) => p.habitable).length}
            </h3>
            <p className="text-gray-300">Potentially Habitable</p>
          </div>

          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-purple/20 rounded-xl p-6 text-center">
            <FaWeight className="text-3xl text-neon-purple mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {exoplanets.filter((p) => p.type === "Terrestrial").length}
            </h3>
            <p className="text-gray-300">Terrestrial Planets</p>
          </div>

          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-pink/20 rounded-xl p-6 text-center">
            <FaCalendarAlt className="text-3xl text-neon-pink mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {new Set(exoplanets.map((p) => p.discoveryYear)).size}
            </h3>
            <p className="text-gray-300">Discovery Years</p>
          </div>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-space font-bold text-gradient mb-4 md:mb-0">
                Data Analysis
              </h2>
              <div className="flex flex-wrap gap-2">
                {chartOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedChart(option.value)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedChart === option.value
                        ? "bg-neon-blue/20 border border-neon-blue/30 text-neon-blue"
                        : "bg-space-gray/50 border border-neon-blue/20 text-gray-400 hover:text-neon-blue"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {SelectedChartComponent && (
              <SelectedChartComponent exoplanets={exoplanets} />
            )}
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-space font-bold text-gradient">
                Exoplanet Locations
              </h2>
              <button
                onClick={() => setShowMap(!showMap)}
                className="btn-neon text-sm py-2 px-4 flex items-center space-x-2"
              >
                <FaEye />
                <span>{showMap ? "Hide Map" : "Show Map"}</span>
              </button>
            </div>

            {showMap && (
              <MapComponent
                type="exoplanets"
                data={exoplanets}
                title="Exoplanet Discovery Locations"
                height={400}
              />
            )}
          </div>
        </motion.div>

        {/* Exoplanet Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ExoplanetTable exoplanets={exoplanets} />
          <div className="flex justify-center mt-6 gap-3">
            <button
              onClick={() => {
                setCurrentPage(currentPage + 1);
                setIsGettingMore(true);
              }}
              className="btn-neon text-sm py-2 px-4 flex items-center space-x-2 disabled:cursor-not-allowed"
              disabled={isGettingMore}
            >
              {isGettingMore ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <FaEye />
                  <span>Load More</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6">
            <h3 className="text-xl font-space font-bold text-gradient mb-4">
              Export Data
            </h3>
            <p className="text-gray-300 mb-6">
              Download exoplanet data in various formats for your research and
              analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-neon text-sm py-2 px-6 flex items-center space-x-2">
                <FaDownload />
                <span>Download CSV</span>
              </button>
              <button className="px-6 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg text-neon-purple hover:text-white transition-all duration-300 flex items-center space-x-2">
                <FaShare />
                <span>Share Data</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Exoplanets;
