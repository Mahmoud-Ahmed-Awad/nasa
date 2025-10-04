import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaInfoCircle,
  FaExternalLinkAlt,
  FaPlay,
  FaPause
} from 'react-icons/fa';

const MissionCard = ({ mission, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-neon-green';
      case 'completed':
        return 'text-neon-blue';
      case 'planned':
        return 'text-neon-purple';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-neon-green/10 border-neon-green/30';
      case 'completed':
        return 'bg-neon-blue/10 border-neon-blue/30';
      case 'planned':
        return 'bg-neon-purple/10 border-neon-purple/30';
      case 'failed':
        return 'bg-red-400/10 border-red-400/30';
      default:
        return 'bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl overflow-hidden hover:border-neon-blue/40 transition-all duration-500 card-hover"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Mission Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={mission.image}
          alt={mission.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          whileHover={{ scale: 1.1 }}
        />
        
        {/* Play Button Overlay */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-16 h-16 bg-neon-blue/80 rounded-full flex items-center justify-center shadow-neon">
            {isPlaying ? (
              <FaPause className="text-white text-xl" />
            ) : (
              <FaPlay className="text-white text-xl ml-1" />
            )}
          </div>
        </motion.button>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(mission.status)} ${getStatusBg(mission.status)}`}>
            {mission.status}
          </span>
        </div>

        {/* Mission Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
            {mission.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Mission Name */}
        <motion.h3
          className="text-xl font-space font-bold text-gradient mb-2 group-hover:text-neon-blue transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
        >
          {mission.name}
        </motion.h3>

        {/* Mission Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
          {mission.description}
        </p>

        {/* Mission Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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

        {/* Progress Bar */}
        {mission.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Mission Progress</span>
              <span className="text-xs font-medium text-neon-blue">{mission.progress}%</span>
            </div>
            <div className="w-full bg-space-gray/50 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${mission.progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 btn-neon text-sm py-2 px-4"
          >
            <FaInfoCircle className="inline mr-2" />
            View Details
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg text-neon-purple hover:text-white transition-all duration-300"
          >
            <FaExternalLinkAlt className="text-sm" />
          </motion.button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(0, 212, 255, 0.1), transparent)',
        }}
      />
    </motion.div>
  );
};

export default MissionCard;

