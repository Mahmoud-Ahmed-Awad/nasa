import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Missions from './pages/Missions';
import Exoplanets from './pages/Exoplanets';
import Satellites from './pages/Satellites';
import Team from './pages/Team';
import Contact from './pages/Contact';

// Context for theme
import { ThemeProvider } from './context/ThemeContext';

// Starfield Background Component
const StarfieldBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y > window.innerHeight ? 0 : particle.y + particle.speed,
          x: particle.x > window.innerWidth ? 0 : particle.x + particle.speed * 0.1,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="starfield"></div>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-neon-blue opacity-30"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [particle.y, particle.y + 20, particle.y],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Page Transition Component
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

// Loading Component
const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-space-dark"
    >
      <div className="text-center">
        <motion.div
          className="w-20 h-20 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h1
          className="text-4xl font-space font-bold text-gradient mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          NASA Explorer
        </motion.h1>
        <motion.p
          className="text-neon-blue text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Initializing Space Mission...
        </motion.p>
      </div>
    </motion.div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="App relative min-h-screen bg-space-dark text-star-white">
          <StarfieldBackground />
          
          <AnimatePresence>
            {isLoading && <LoadingScreen />}
          </AnimatePresence>

          <div className="relative z-10">
            <Navbar />
            
            <main className="pt-20">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <PageTransition>
                        <Home />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/missions" 
                    element={
                      <PageTransition>
                        <Missions />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/exoplanets" 
                    element={
                      <PageTransition>
                        <Exoplanets />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/satellites" 
                    element={
                      <PageTransition>
                        <Satellites />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/team" 
                    element={
                      <PageTransition>
                        <Team />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/contact" 
                    element={
                      <PageTransition>
                        <Contact />
                      </PageTransition>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </main>

            <Footer />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

