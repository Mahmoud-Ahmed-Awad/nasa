import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt, FaDownload, FaShare } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, size = 'medium', showActions = true }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'max-w-md';
      case 'large':
        return 'max-w-4xl';
      case 'extra-large':
        return 'max-w-6xl';
      default:
        return 'max-w-2xl';
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            className={`relative w-full ${getSizeClasses()} max-h-[90vh] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neon-blue/20">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-space font-bold text-gradient"
                >
                  {title}
                </motion.h2>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg bg-space-gray/50 hover:bg-red-500/20 border border-neon-blue/20 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-all duration-300"
                  aria-label="Close modal"
                >
                  <FaTimes className="text-lg" />
                </motion.button>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
              >
                {children}
              </motion.div>

              {/* Footer Actions */}
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-end space-x-3 p-6 border-t border-neon-blue/20 bg-space-gray/20"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-space-gray/50 hover:bg-neon-blue/20 border border-neon-blue/20 hover:border-neon-blue/40 rounded-lg text-neon-blue hover:text-white transition-all duration-300 flex items-center space-x-2"
                  >
                    <FaShare className="text-sm" />
                    <span>Share</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-space-gray/50 hover:bg-neon-green/20 border border-neon-green/20 hover:border-neon-green/40 rounded-lg text-neon-green hover:text-white transition-all duration-300 flex items-center space-x-2"
                  >
                    <FaDownload className="text-sm" />
                    <span>Download</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30 rounded-lg text-neon-blue hover:text-white transition-all duration-300 flex items-center space-x-2"
                  >
                    <FaExternalLinkAlt className="text-sm" />
                    <span>Learn More</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Specialized Modal Components
export const MissionModal = ({ isOpen, onClose, mission }) => {
  if (!mission) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mission.name} size="large">
      <div className="space-y-6">
        {/* Mission Image */}
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img
            src={mission.image}
            alt={mission.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
              {mission.status}
            </span>
          </div>
        </div>

        {/* Mission Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-neon-blue mb-3">Mission Overview</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              {mission.description}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Launch Date:</span>
                <span className="text-star-white">{mission.launchDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-star-white">{mission.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rocket:</span>
                <span className="text-star-white">{mission.rocket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Crew:</span>
                <span className="text-star-white">{mission.crew}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neon-blue mb-3">Mission Objectives</h3>
            <ul className="space-y-2">
              {mission.objectives?.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-neon-blue mb-3 mt-6">Key Achievements</h3>
            <ul className="space-y-2">
              {mission.achievements?.map((achievement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-300">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mission Timeline */}
        {mission.timeline && (
          <div>
            <h3 className="text-lg font-semibold text-neon-blue mb-4">Mission Timeline</h3>
            <div className="space-y-4">
              {mission.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-4 h-4 bg-neon-purple rounded-full mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-star-white">{event.date}</div>
                    <div className="text-gray-300">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export const SatelliteModal = ({ isOpen, onClose, satellite }) => {
  if (!satellite) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={satellite.name} size="large">
      <div className="space-y-6">
        {/* Satellite Image */}
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img
            src={satellite.image}
            alt={satellite.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
              {satellite.status}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
              {satellite.type}
            </span>
          </div>
        </div>

        {/* Satellite Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-neon-blue mb-3">Satellite Information</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              {satellite.description}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Launch Date:</span>
                <span className="text-star-white">{satellite.launchDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Orbit:</span>
                <span className="text-star-white">{satellite.orbit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Altitude:</span>
                <span className="text-star-white">{satellite.altitude} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mass:</span>
                <span className="text-star-white">{satellite.mass} kg</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neon-blue mb-3">Technical Specifications</h3>
            <div className="space-y-2">
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
              <div className="flex justify-between">
                <span className="text-gray-400">Signal Strength:</span>
                <span className="text-neon-green">{satellite.signalStrength}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Details */}
        {satellite.missionDetails && (
          <div>
            <h3 className="text-lg font-semibold text-neon-blue mb-3">Mission Details</h3>
            <div className="bg-space-gray/20 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                {satellite.missionDetails}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Modal;

