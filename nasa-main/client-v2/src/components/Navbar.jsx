import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaSun, 
  FaMoon, 
  FaRocket, 
  FaGlobe, 
  FaSatellite, 
  FaUsers, 
  FaEnvelope,
  FaHome
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/missions', label: 'Missions', icon: FaRocket },
    { path: '/exoplanets', label: 'Exoplanets', icon: FaGlobe },
    { path: '/satellites', label: 'Satellites', icon: FaSatellite },
    { path: '/team', label: 'Team', icon: FaUsers },
    { path: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-space-dark/90 backdrop-blur-md border-b border-neon-blue/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <FaRocket className="text-white text-lg" />
              </div>
              <span className="text-xl font-space font-bold text-gradient">
                NASA Explorer
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/30'
                        : 'text-star-white hover:text-neon-blue hover:bg-neon-blue/5'
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-space-gray/50 hover:bg-neon-blue/10 border border-neon-blue/20 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FaSun className="text-yellow-400 text-lg" />
              ) : (
                <FaMoon className="text-neon-blue text-lg" />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg bg-space-gray/50 hover:bg-neon-blue/10 border border-neon-blue/20 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="text-neon-blue text-lg" />
              ) : (
                <FaBars className="text-neon-blue text-lg" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-space-dark/95 backdrop-blur-md border-t border-neon-blue/20"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/30'
                          : 'text-star-white hover:text-neon-blue hover:bg-neon-blue/5'
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span className="font-medium text-lg">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

