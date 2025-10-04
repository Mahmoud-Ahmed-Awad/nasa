import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedin,
  FaRocket,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp
} from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: FaTwitter, href: 'https://twitter.com/nasa', label: 'Twitter' },
    { icon: FaFacebook, href: 'https://facebook.com/NASA', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com/nasa', label: 'Instagram' },
    { icon: FaYoutube, href: 'https://youtube.com/nasa', label: 'YouTube' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/nasa', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { label: 'About NASA', href: 'https://www.nasa.gov/about' },
    { label: 'Missions', href: 'https://www.nasa.gov/missions' },
    { label: 'News', href: 'https://www.nasa.gov/news' },
    { label: 'Images', href: 'https://www.nasa.gov/multimedia/imagegallery' },
    { label: 'Videos', href: 'https://www.nasa.gov/multimedia/videogallery' },
  ];

  const resources = [
    { label: 'NASA TV', href: 'https://www.nasa.gov/live' },
    { label: 'Education', href: 'https://www.nasa.gov/audience/forstudents' },
    { label: 'Careers', href: 'https://www.nasa.gov/careers' },
    { label: 'Internships', href: 'https://www.nasa.gov/audience/forstudents/internships' },
    { label: 'Research', href: 'https://www.nasa.gov/topics/technology' },
  ];

  return (
    <footer className="relative bg-space-dark/95 backdrop-blur-md border-t border-neon-blue/20 mt-20">
      {/* Scroll to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center shadow-neon hover:shadow-neon-purple transition-all duration-300"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="text-white text-lg" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <FaRocket className="text-white text-lg" />
              </div>
              <span className="text-xl font-space font-bold text-gradient">
                NASA Explorer
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Exploring the universe and beyond. Discover the latest missions, 
              exoplanets, satellites, and space exploration achievements.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="w-10 h-10 bg-space-gray/50 hover:bg-neon-blue/20 border border-neon-blue/20 rounded-lg flex items-center justify-center text-neon-blue hover:text-neon-purple transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="text-lg" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-space font-semibold text-neon-blue mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-neon-blue transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-neon-blue mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-space font-semibold text-neon-blue mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <motion.li
                  key={resource.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-neon-blue transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-neon-blue mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {resource.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-space font-semibold text-neon-blue mb-4">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-neon-blue text-sm" />
                <span className="text-gray-300 text-sm">
                  NASA Headquarters<br />
                  Washington, DC 20546
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-neon-blue text-sm" />
                <span className="text-gray-300 text-sm">
                  +1 (202) 358-0001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-neon-blue text-sm" />
                <span className="text-gray-300 text-sm">
                  public-inquiries@nasa.gov
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-neon-blue/20 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 NASA Explorer Platform. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">
                Accessibility
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

