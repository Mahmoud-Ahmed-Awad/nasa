import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSatellite, 
  FaFilter, 
  FaSearch, 
  FaMapMarkerAlt,
  FaSignal,
  FaGlobe,
  FaWeight,
  FaThermometerHalf,
  FaCalendarAlt,
  FaEye,
  FaDownload,
  FaShare,
  FaRocket
} from 'react-icons/fa';
import SatelliteCard from '../components/SatelliteCard';
import Modal, { SatelliteModal } from '../components/Modal';
import ChartComponent, { SatelliteStatusChart } from '../components/ChartComponent';
import MapComponent from '../components/MapComponent';

const Satellites = () => {
  const [satellites, setSatellites] = useState([]);
  const [filteredSatellites, setFilteredSatellites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or map
  const [showMap, setShowMap] = useState(false);

  // Sample satellite data
  const sampleSatellites = [
    {
      id: 1,
      name: "International Space Station",
      description: "The International Space Station is a modular space station in low Earth orbit. It is a multinational collaborative project involving five participating space agencies.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Scientific",
      launchDate: "November 20, 1998",
      orbit: "Low Earth Orbit (LEO)",
      altitude: 408,
      mass: 450000,
      power: 120000,
      frequency: "VHF/UHF",
      coverage: "Global",
      lifetime: 25,
      signalStrength: 95,
      missionProgress: 85,
      coordinates: [51.6, 0.0], // Approximate ISS position
      missionDetails: "The ISS serves as a microgravity and space environment research laboratory in which scientific research is conducted in astrobiology, astronomy, meteorology, physics, and other fields."
    },
    {
      id: 2,
      name: "Hubble Space Telescope",
      description: "The Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation. It was not the first space telescope, but it is one of the largest and most versatile.",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Scientific",
      launchDate: "April 24, 1990",
      orbit: "Low Earth Orbit (LEO)",
      altitude: 547,
      mass: 11110,
      power: 2800,
      frequency: "S-band",
      coverage: "Deep Space",
      lifetime: 30,
      signalStrength: 88,
      missionProgress: 95,
      coordinates: [28.5, -80.6],
      missionDetails: "Hubble has made more than 1.4 million observations and has been used to publish more than 18,000 peer-reviewed scientific papers on topics in astronomy, physics, and other sciences."
    },
    {
      id: 3,
      name: "GPS III SV01",
      description: "GPS III SV01 is the first satellite in the GPS III constellation, providing improved accuracy, enhanced security, and better resistance to jamming.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Navigation",
      launchDate: "December 23, 2018",
      orbit: "Medium Earth Orbit (MEO)",
      altitude: 20180,
      mass: 3680,
      power: 4480,
      frequency: "L-band",
      coverage: "Global",
      lifetime: 15,
      signalStrength: 92,
      missionProgress: 100,
      coordinates: [0.0, 0.0],
      missionDetails: "GPS III satellites provide three times better accuracy and up to eight times improved anti-jamming capabilities compared to previous GPS satellites."
    },
    {
      id: 4,
      name: "GOES-16",
      description: "GOES-16 is the first of the GOES-R series of geostationary weather satellites, providing advanced imagery and atmospheric measurements of Earth's weather, oceans, and environment.",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Weather",
      launchDate: "November 19, 2016",
      orbit: "Geostationary Orbit (GEO)",
      altitude: 35786,
      mass: 2800,
      power: 4000,
      frequency: "S-band",
      coverage: "Western Hemisphere",
      lifetime: 15,
      signalStrength: 90,
      missionProgress: 100,
      coordinates: [0.0, -75.0],
      missionDetails: "GOES-16 provides real-time weather monitoring, severe weather tracking, and environmental data for the United States and surrounding areas."
    },
    {
      id: 5,
      name: "Starlink-1000",
      description: "Starlink is a satellite internet constellation operated by SpaceX, providing satellite Internet access coverage to most of the Earth.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Communication",
      launchDate: "May 24, 2019",
      orbit: "Low Earth Orbit (LEO)",
      altitude: 550,
      mass: 260,
      power: 2000,
      frequency: "Ku-band",
      coverage: "Regional",
      lifetime: 5,
      signalStrength: 85,
      missionProgress: 80,
      coordinates: [45.0, -122.0],
      missionDetails: "Starlink satellites provide high-speed, low-latency broadband internet to users worldwide, particularly in rural and remote areas."
    },
    {
      id: 6,
      name: "James Webb Space Telescope",
      description: "The James Webb Space Telescope is the most powerful space telescope ever built, designed to study the early universe and exoplanets.",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Scientific",
      launchDate: "December 25, 2021",
      orbit: "Sun-Earth L2",
      altitude: 1500000,
      mass: 6500,
      power: 2000,
      frequency: "S-band",
      coverage: "Deep Space",
      lifetime: 10,
      signalStrength: 75,
      missionProgress: 95,
      coordinates: [0.0, 0.0],
      missionDetails: "JWST is designed to study the formation of the first galaxies, the birth of stars and planets, and the atmospheres of exoplanets."
    },
    {
      id: 7,
      name: "Landsat 9",
      description: "Landsat 9 is the latest satellite in the Landsat program, continuing the longest space-based record of Earth's land surface.",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Earth Observation",
      launchDate: "September 27, 2021",
      orbit: "Sun-synchronous Orbit",
      altitude: 705,
      mass: 2850,
      power: 3000,
      frequency: "S-band",
      coverage: "Global",
      lifetime: 15,
      signalStrength: 88,
      missionProgress: 100,
      coordinates: [45.0, -122.0],
      missionDetails: "Landsat 9 provides high-quality, global, repetitive observations of Earth's land surfaces, supporting agriculture, forestry, and environmental monitoring."
    },
    {
      id: 8,
      name: "Terra",
      description: "Terra is a multi-national NASA scientific research satellite in a Sun-synchronous orbit around Earth, studying the interactions between Earth's atmosphere, land, and oceans.",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Earth Observation",
      launchDate: "December 18, 1999",
      orbit: "Sun-synchronous Orbit",
      altitude: 705,
      mass: 4864,
      power: 2500,
      frequency: "S-band",
      coverage: "Global",
      lifetime: 20,
      signalStrength: 82,
      missionProgress: 90,
      coordinates: [45.0, -122.0],
      missionDetails: "Terra carries five instruments that observe Earth's atmosphere, land, and oceans, providing data for climate change research and environmental monitoring."
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setSatellites(sampleSatellites);
      setFilteredSatellites(sampleSatellites);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = satellites;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(satellite =>
        satellite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        satellite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        satellite.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(satellite => satellite.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(satellite => satellite.status.toLowerCase() === filterStatus.toLowerCase());
    }

    setFilteredSatellites(filtered);
  }, [satellites, searchTerm, filterType, filterStatus]);

  const getUniqueTypes = () => {
    const types = satellites.map(satellite => satellite.type);
    return [...new Set(types)];
  };

  const getUniqueStatuses = () => {
    const statuses = satellites.map(satellite => satellite.status);
    return [...new Set(statuses)];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-blue text-lg">Loading satellites...</p>
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
            Satellite Network
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor the global satellite network with real-time tracking, 
            technical specifications, and mission status updates.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 text-center">
            <FaSatellite className="text-3xl text-neon-blue mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {satellites.length}
            </h3>
            <p className="text-gray-300">Total Satellites</p>
          </div>
          
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-green/20 rounded-xl p-6 text-center">
            <FaSignal className="text-3xl text-neon-green mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {satellites.filter(s => s.status === 'Active').length}
            </h3>
            <p className="text-gray-300">Active Satellites</p>
          </div>
          
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-purple/20 rounded-xl p-6 text-center">
            <FaGlobe className="text-3xl text-neon-purple mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {getUniqueTypes().length}
            </h3>
            <p className="text-gray-300">Satellite Types</p>
          </div>
          
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-pink/20 rounded-xl p-6 text-center">
            <FaRocket className="text-3xl text-neon-pink mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {new Set(satellites.map(s => s.launchDate.split(' ')[2])).size}
            </h3>
            <p className="text-gray-300">Launch Years</p>
          </div>
        </motion.div>

        {/* Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <SatelliteStatusChart satellites={satellites} />
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
              <input
                type="text"
                placeholder="Search satellites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 form-input focus:border-neon-blue focus:shadow-neon"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-input"
            >
              <option value="all">All Types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              {getUniqueStatuses().map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-neon-blue/20 border border-neon-blue/30 text-neon-blue'
                    : 'bg-space-gray/50 border border-neon-blue/20 text-gray-400 hover:text-neon-blue'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'map'
                    ? 'bg-neon-blue/20 border border-neon-blue/30 text-neon-blue'
                    : 'bg-space-gray/50 border border-neon-blue/20 text-gray-400 hover:text-neon-blue'
                }`}
              >
                Map
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-neon-blue font-medium">
              {filteredSatellites.length} satellites found
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <span>Active: {satellites.filter(s => s.status === 'Active').length}</span>
              <span>Inactive: {satellites.filter(s => s.status === 'Inactive').length}</span>
              <span>Planned: {satellites.filter(s => s.status === 'Planned').length}</span>
            </div>
          </div>
        </motion.div>

        {/* Satellites Grid or Map */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredSatellites.map((satellite, index) => (
                <SatelliteCard
                  key={satellite.id}
                  satellite={satellite}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MapComponent
                type="satellites"
                data={filteredSatellites}
                title="Satellite Network Map"
                height={600}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredSatellites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FaSatellite className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-space font-bold text-gray-400 mb-2">
              No satellites found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}

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
              Download satellite data in various formats for your research and analysis.
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

      {/* Satellite Detail Modal */}
      <SatelliteModal
        isOpen={!!selectedSatellite}
        onClose={() => setSelectedSatellite(null)}
        satellite={selectedSatellite}
      />
    </div>
  );
};

export default Satellites;

