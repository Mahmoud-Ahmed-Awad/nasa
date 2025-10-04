import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSatellite, 
  FaRocket, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaInfoCircle,
  FaExternalLinkAlt,
  FaPlay,
  FaPause,
  FaSignal,
  FaGlobe,
  FaWeight,
  FaThermometerHalf
} from 'react-icons/fa';

const SatelliteCard = ({ satellite, index }) => {
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
      case 'inactive':
        return 'text-gray-400';
      case 'planned':
        return 'text-neon-purple';
      case 'decommissioned':
        return 'text-red-400';
      default:
        return 'text-neon-blue';
    }
  };

  const getStatusBg = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-neon-green/10 border-neon-green/30';
      case 'inactive':
        return 'bg-gray-400/10 border-gray-400/30';
      case 'planned':
        return 'bg-neon-purple/10 border-neon-purple/30';
      case 'decommissioned':
        return 'bg-red-400/10 border-red-400/30';
      default:
        return 'bg-neon-blue/10 border-neon-blue/30';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'communication':
        return 'text-neon-blue bg-neon-blue/10 border-neon-blue/30';
      case 'weather':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
      case 'navigation':
        return 'text-neon-green bg-neon-green/10 border-neon-green/30';
      case 'scientific':
        return 'text-neon-purple bg-neon-purple/10 border-neon-purple/30';
      case 'military':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
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
      
      {/* Satellite Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={satellite.image}
          alt={satellite.name}
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
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(satellite.status)} ${getStatusBg(satellite.status)}`}>
            {satellite.status}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(satellite.type)}`}>
            {satellite.type}
          </span>
        </div>

        {/* Signal Strength Indicator */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
            <FaSignal className={`text-sm ${satellite.status === 'active' ? 'text-neon-green' : 'text-gray-400'}`} />
            <span className="text-xs text-white font-medium">
              {satellite.signalStrength}%
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Satellite Name */}
        <motion.h3
          className="text-xl font-space font-bold text-gradient mb-2 group-hover:text-neon-blue transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
        >
          {satellite.name}
        </motion.h3>

        {/* Satellite Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
          {satellite.description}
        </p>

        {/* Satellite Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-neon-blue text-sm" />
            <div>
              <p className="text-xs text-gray-400">Launch Date</p>
              <p className="text-sm font-medium text-star-white">{satellite.launchDate}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaGlobe className="text-neon-green text-sm" />
            <div>
              <p className="text-xs text-gray-400">Orbit</p>
              <p className="text-sm font-medium text-star-white">{satellite.orbit}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaWeight className="text-neon-purple text-sm" />
            <div>
              <p className="text-xs text-gray-400">Mass</p>
              <p className="text-sm font-medium text-star-white">{satellite.mass} kg</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaThermometerHalf className="text-red-400 text-sm" />
            <div>
              <p className="text-xs text-gray-400">Altitude</p>
              <p className="text-sm font-medium text-star-white">{satellite.altitude} km</p>
            </div>
          </div>
        </div>

        {/* Mission Progress */}
        {satellite.missionProgress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Mission Progress</span>
              <span className="text-xs font-medium text-neon-blue">{satellite.missionProgress}%</span>
            </div>
            <div className="w-full bg-space-gray/50 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${satellite.missionProgress}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
              />
            </div>
          </div>
        )}

        {/* Technical Specifications */}
        <div className="mb-6 p-4 bg-space-gray/20 rounded-lg">
          <h4 className="text-sm font-semibold text-neon-blue mb-2">Technical Specs</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Power:</span>
              <span className="text-star-white">{satellite.power}W</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frequency:</span>
              <span className="text-star-white">{satellite.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Coverage:</span>
              <span className="text-star-white">{satellite.coverage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Lifetime:</span>
              <span className="text-star-white">{satellite.lifetime} years</span>
            </div>
          </div>
        </div>

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

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(0, 212, 255, 0.3), transparent)',
          backgroundClip: 'border-box',
        }}
        animate={{
          background: isHovered 
            ? 'linear-gradient(45deg, rgba(0, 212, 255, 0.3), rgba(139, 92, 246, 0.3), rgba(0, 212, 255, 0.3))'
            : 'linear-gradient(45deg, transparent, rgba(0, 212, 255, 0.1), transparent)',
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default SatelliteCard;

