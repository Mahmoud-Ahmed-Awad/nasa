import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FaRocket, 
  FaGlobe, 
  FaSatellite, 
  FaUsers, 
  FaArrowRight,
  FaPlay,
  FaChartLine,
  FaAward,
  FaSearch,
  FaStar,
  FaCompass
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Hero slides data
  const heroSlides = [
    {
      title: "Explore the Universe",
      subtitle: "Discover the wonders of space through NASA's latest missions and discoveries",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      cta: "Start Exploring"
    },
    {
      title: "Mission to Mars",
      subtitle: "Follow NASA's journey to the Red Planet and beyond",
      image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      cta: "View Missions"
    },
    {
      title: "Exoplanet Discovery",
      subtitle: "Explore worlds beyond our solar system",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      cta: "Discover Planets"
    }
  ];

  // Stats data
  const stats = [
    { number: "500+", label: "Active Missions", icon: FaRocket },
    { number: "5,000+", label: "Exoplanets Found", icon: FaGlobe },
    { number: "2,000+", label: "Satellites in Orbit", icon: FaSatellite },
    { number: "50+", label: "Years of Exploration", icon: FaAward }
  ];

  // Features data
  const features = [
    {
      icon: FaRocket,
      title: "Mission Tracking",
      description: "Follow NASA's active missions in real-time with detailed information and progress updates.",
      color: "neon-blue"
    },
    {
      icon: FaGlobe,
      title: "Exoplanet Database",
      description: "Explore thousands of discovered exoplanets with interactive data and visualizations.",
      color: "neon-purple"
    },
    {
      icon: FaSatellite,
      title: "Satellite Network",
      description: "Monitor the global satellite network with live tracking and technical specifications.",
      color: "neon-green"
    },
    {
      icon: FaChartLine,
      title: "Data Analytics",
      description: "Access comprehensive space data with advanced charts and statistical analysis.",
      color: "neon-pink"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.1
              }}
              transition={{ duration: 1 }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-7xl font-space font-bold text-gradient mb-6"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
              
              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>

              <motion.div
                key={`cta-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/missions">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-neon text-lg px-8 py-4 flex items-center space-x-2"
                  >
                    <span>{heroSlides[currentSlide].cta}</span>
                    <FaArrowRight />
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white transition-all duration-300 rounded-lg flex items-center space-x-2"
                >
                  <FaPlay />
                  <span>Watch Video</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-neon-blue scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ y }}
          className="absolute bottom-8 right-8 flex flex-col items-center space-y-2 text-neon-blue"
        >
          <span className="text-sm font-medium">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-neon-blue rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-neon-blue rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-space-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white text-2xl" />
                  </div>
                  <motion.h3
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-space font-bold text-gradient mb-2"
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-gray-300 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold text-gradient mb-6">
              Explore Space Like Never Before
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access comprehensive space data, track missions in real-time, and discover the wonders of our universe through cutting-edge technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 hover:border-neon-blue/40 transition-all duration-500 card-hover group"
                >
                  <div className={`w-12 h-12 bg-${feature.color}/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`text-${feature.color} text-xl`} />
                  </div>
                  <h3 className="text-xl font-space font-bold text-star-white mb-3 group-hover:text-neon-blue transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-space-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold text-gradient mb-6">
              Quick Access
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Jump directly to the information you need with our organized sections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/missions">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 backdrop-blur-sm border border-neon-blue/30 rounded-xl p-8 text-center hover:border-neon-blue/50 transition-all duration-500 card-hover group"
              >
                <FaRocket className="text-4xl text-neon-blue mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-space font-bold text-star-white mb-3 group-hover:text-neon-blue transition-colors duration-300">
                  Missions
                </h3>
                <p className="text-gray-300 mb-4">
                  Explore NASA's current and upcoming space missions
                </p>
                <FaArrowRight className="text-neon-blue group-hover:translate-x-2 transition-transform duration-300" />
              </motion.div>
            </Link>

            <Link to="/exoplanets">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 backdrop-blur-sm border border-neon-purple/30 rounded-xl p-8 text-center hover:border-neon-purple/50 transition-all duration-500 card-hover group"
              >
                <FaGlobe className="text-4xl text-neon-purple mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-space font-bold text-star-white mb-3 group-hover:text-neon-purple transition-colors duration-300">
                  Exoplanets
                </h3>
                <p className="text-gray-300 mb-4">
                  Discover worlds beyond our solar system
                </p>
                <FaArrowRight className="text-neon-purple group-hover:translate-x-2 transition-transform duration-300" />
              </motion.div>
            </Link>

            <Link to="/satellites">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-neon-green/10 to-neon-blue/10 backdrop-blur-sm border border-neon-green/30 rounded-xl p-8 text-center hover:border-neon-green/50 transition-all duration-500 card-hover group"
              >
                <FaSatellite className="text-4xl text-neon-green mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-space font-bold text-star-white mb-3 group-hover:text-neon-green transition-colors duration-300">
                  Satellites
                </h3>
                <p className="text-gray-300 mb-4">
                  Track satellites and space stations in real-time
                </p>
                <FaArrowRight className="text-neon-green group-hover:translate-x-2 transition-transform duration-300" />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold text-gradient mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join millions of space enthusiasts in discovering the wonders of our universe. 
              Start your journey today with NASA Explorer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/missions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-neon text-lg px-8 py-4 flex items-center space-x-2"
                >
                  <FaCompass />
                  <span>Start Exploring</span>
                </motion.button>
              </Link>
              
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white transition-all duration-300 rounded-lg flex items-center space-x-2"
                >
                  <FaUsers />
                  <span>Join Community</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

