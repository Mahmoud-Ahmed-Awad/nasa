import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRocket, 
  FaFilter, 
  FaSearch, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaUsers,
  FaInfoCircle,
  FaPlay,
  FaPause,
  FaExternalLinkAlt
} from 'react-icons/fa';
import MissionCard from '../components/MissionCard';
import Modal, { MissionModal } from '../components/Modal';
import ChartComponent, { MissionTimelineChart } from '../components/ChartComponent';

const Missions = () => {
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMission, setSelectedMission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or timeline

  // Sample mission data
  const sampleMissions = [
    {
      id: 1,
      name: "Artemis I",
      description: "First integrated test of NASA's deep space exploration systems: the Space Launch System (SLS) rocket, Orion spacecraft, and the ground systems at Kennedy Space Center.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Completed",
      type: "Lunar Mission",
      launchDate: "November 16, 2022",
      location: "Kennedy Space Center, Florida",
      rocket: "Space Launch System (SLS)",
      crew: "Uncrewed",
      progress: 100,
      objectives: [
        "Test SLS rocket performance",
        "Validate Orion spacecraft systems",
        "Demonstrate deep space navigation",
        "Test heat shield performance"
      ],
      achievements: [
        "Successfully launched SLS rocket",
        "Orion completed lunar flyby",
        "Splashdown in Pacific Ocean",
        "All systems performed nominally"
      ],
      timeline: [
        { date: "Nov 16, 2022", description: "Launch from Kennedy Space Center" },
        { date: "Nov 21, 2022", description: "Lunar flyby and orbit insertion" },
        { date: "Nov 25, 2022", description: "Orion reached maximum distance from Earth" },
        { date: "Dec 11, 2022", description: "Splashdown in Pacific Ocean" }
      ]
    },
    {
      id: 2,
      name: "Mars Perseverance",
      description: "The Mars 2020 Perseverance rover mission is part of NASA's Mars Exploration Program, a long-term effort of robotic exploration of the Red Planet.",
      image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Mars Rover",
      launchDate: "July 30, 2020",
      location: "Cape Canaveral, Florida",
      rocket: "Atlas V 541",
      crew: "Uncrewed",
      progress: 85,
      objectives: [
        "Search for signs of ancient life",
        "Collect and cache rock samples",
        "Test oxygen production from atmosphere",
        "Demonstrate helicopter flight on Mars"
      ],
      achievements: [
        "Successful landing in Jezero Crater",
        "Ingenuity helicopter first flight",
        "Multiple rock samples collected",
        "Oxygen production demonstration"
      ],
      timeline: [
        { date: "Jul 30, 2020", description: "Launch from Cape Canaveral" },
        { date: "Feb 18, 2021", description: "Landing in Jezero Crater" },
        { date: "Apr 19, 2021", description: "Ingenuity first flight" },
        { date: "Sep 2021", description: "First rock sample collected" }
      ]
    },
    {
      id: 3,
      name: "James Webb Space Telescope",
      description: "The James Webb Space Telescope is the world's premier space science observatory, designed to solve mysteries in our solar system and look beyond to distant worlds.",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Active",
      type: "Space Telescope",
      launchDate: "December 25, 2021",
      location: "Kourou, French Guiana",
      rocket: "Ariane 5",
      crew: "Uncrewed",
      progress: 95,
      objectives: [
        "Study the early universe",
        "Observe galaxy formation",
        "Examine exoplanet atmospheres",
        "Investigate star and planet formation"
      ],
      achievements: [
        "Successful launch and deployment",
        "First deep field image released",
        "Exoplanet atmosphere analysis",
        "Distant galaxy observations"
      ],
      timeline: [
        { date: "Dec 25, 2021", description: "Launch from French Guiana" },
        { date: "Jan 2022", description: "Telescope deployment completed" },
        { date: "Jul 2022", description: "First science images released" },
        { date: "Ongoing", description: "Continuous scientific observations" }
      ]
    },
    {
      id: 4,
      name: "Artemis II",
      description: "Artemis II will be the first crewed mission of NASA's Artemis program, sending astronauts around the Moon and back to Earth.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Planned",
      type: "Lunar Mission",
      launchDate: "November 2024",
      location: "Kennedy Space Center, Florida",
      rocket: "Space Launch System (SLS)",
      crew: "4 Astronauts",
      progress: 60,
      objectives: [
        "First crewed test of SLS and Orion",
        "Validate life support systems",
                "Test deep space communication",
        "Demonstrate crew safety systems"
      ],
      achievements: [],
      timeline: [
        { date: "2024", description: "Crew selection and training" },
        { date: "Nov 2024", description: "Planned launch date" },
        { date: "TBD", description: "Lunar flyby mission" },
        { date: "TBD", description: "Return to Earth" }
      ]
    },
    {
      id: 5,
      name: "Europa Clipper",
      description: "Europa Clipper will conduct detailed reconnaissance of Jupiter's moon Europa and investigate whether the icy moon could harbor conditions suitable for life.",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "In Development",
      type: "Planetary Mission",
      launchDate: "October 2024",
      location: "Kennedy Space Center, Florida",
      rocket: "Falcon Heavy",
      crew: "Uncrewed",
      progress: 75,
      objectives: [
        "Study Europa's ice shell and ocean",
        "Investigate composition and geology",
        "Search for signs of life",
        "Characterize the radiation environment"
      ],
      achievements: [],
      timeline: [
        { date: "2024", description: "Spacecraft assembly and testing" },
        { date: "Oct 2024", description: "Planned launch" },
        { date: "2030", description: "Arrival at Jupiter" },
        { date: "2030-2034", description: "Science operations" }
      ]
    },
    {
      id: 6,
      name: "DART Mission",
      description: "The Double Asteroid Redirection Test (DART) was the first mission to demonstrate asteroid deflection by kinetic impactor.",
      image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      status: "Completed",
      type: "Asteroid Mission",
      launchDate: "November 24, 2021",
      location: "Vandenberg Space Force Base, California",
      rocket: "Falcon 9",
      crew: "Uncrewed",
      progress: 100,
      objectives: [
        "Test kinetic impactor technology",
        "Measure asteroid deflection",
        "Validate planetary defense techniques",
        "Study asteroid composition"
      ],
      achievements: [
        "Successful impact with Dimorphos",
        "Measured orbital period change",
        "Validated deflection technology",
        "Advanced planetary defense capabilities"
      ],
      timeline: [
        { date: "Nov 24, 2021", description: "Launch from Vandenberg" },
        { date: "Sep 26, 2022", description: "Impact with Dimorphos" },
        { date: "Oct 2022", description: "Orbital period change confirmed" },
        { date: "Ongoing", description: "Data analysis continues" }
      ]
    }
  ];

  // Mission timeline data for chart
  const missionTimelineData = [
    { year: 2020, count: 3 },
    { year: 2021, count: 4 },
    { year: 2022, count: 5 },
    { year: 2023, count: 2 },
    { year: 2024, count: 3 }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setMissions(sampleMissions);
      setFilteredMissions(sampleMissions);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = missions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(mission =>
        mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Year filter
    if (filterYear !== 'all') {
      filtered = filtered.filter(mission => {
        const year = new Date(mission.launchDate).getFullYear();
        return year.toString() === filterYear;
      });
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(mission => mission.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(mission => mission.status.toLowerCase() === filterStatus.toLowerCase());
    }

    setFilteredMissions(filtered);
  }, [missions, searchTerm, filterYear, filterType, filterStatus]);

  const getUniqueYears = () => {
    const years = missions.map(mission => new Date(mission.launchDate).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  };

  const getUniqueTypes = () => {
    const types = missions.map(mission => mission.type);
    return [...new Set(types)];
  };

  const getUniqueStatuses = () => {
    const statuses = missions.map(mission => mission.status);
    return [...new Set(statuses)];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-blue text-lg">Loading missions...</p>
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
            NASA Missions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore NASA's current, past, and future space missions. Track progress, 
            learn about objectives, and discover the incredible achievements of space exploration.
          </p>
        </motion.div>

        {/* Mission Timeline Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <MissionTimelineChart missions={missionTimelineData} />
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
              <input
                type="text"
                placeholder="Search missions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 form-input focus:border-neon-blue focus:shadow-neon"
              />
            </div>

            {/* Year Filter */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="form-input"
            >
              <option value="all">All Years</option>
              {getUniqueYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

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
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'timeline'
                    ? 'bg-neon-blue/20 border border-neon-blue/30 text-neon-blue'
                    : 'bg-space-gray/50 border border-neon-blue/20 text-gray-400 hover:text-neon-blue'
                }`}
              >
                Timeline
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-neon-blue font-medium">
              {filteredMissions.length} missions found
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <span>Active: {missions.filter(m => m.status === 'Active').length}</span>
              <span>Completed: {missions.filter(m => m.status === 'Completed').length}</span>
              <span>Planned: {missions.filter(m => m.status === 'Planned').length}</span>
            </div>
          </div>
        </motion.div>

        {/* Missions Grid */}
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
              {filteredMissions.map((mission, index) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {filteredMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 hover:border-neon-blue/40 transition-all duration-500 card-hover"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img
                        src={mission.image}
                        alt={mission.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-space font-bold text-gradient">
                          {mission.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          mission.status === 'Active' ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' :
                          mission.status === 'Completed' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' :
                          'bg-neon-purple/10 text-neon-purple border border-neon-purple/30'
                        }`}>
                          {mission.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {mission.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-neon-blue text-sm" />
                          <div>
                            <p className="text-xs text-gray-400">Launch Date</p>
                            <p className="text-sm font-medium text-star-white">{mission.launchDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaMapMarkerAlt className="text-neon-green text-sm" />
                          <div>
                            <p className="text-xs text-gray-400">Location</p>
                            <p className="text-sm font-medium text-star-white">{mission.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaRocket className="text-neon-purple text-sm" />
                          <div>
                            <p className="text-xs text-gray-400">Rocket</p>
                            <p className="text-sm font-medium text-star-white">{mission.rocket}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaUsers className="text-neon-pink text-sm" />
                          <div>
                            <p className="text-xs text-gray-400">Crew</p>
                            <p className="text-sm font-medium text-star-white">{mission.crew}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedMission(mission)}
                          className="btn-neon text-sm py-2 px-4 flex items-center space-x-2"
                        >
                          <FaInfoCircle />
                          <span>View Details</span>
                        </button>
                        <button className="px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg text-neon-purple hover:text-white transition-all duration-300">
                          <FaExternalLinkAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredMissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FaRocket className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-space font-bold text-gray-400 mb-2">
              No missions found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>

      {/* Mission Detail Modal */}
      <MissionModal
        isOpen={!!selectedMission}
        onClose={() => setSelectedMission(null)}
        mission={selectedMission}
      />
    </div>
  );
};

export default Missions;

