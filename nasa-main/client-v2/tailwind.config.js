/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "space-dark": "#0a0a0a",
        "space-gray": "#1a1a1a",
        "neon-blue": "#00d4ff",
        "neon-purple": "#8b5cf6",
        "neon-green": "#10b981",
        "neon-pink": "#ec4899",
        "star-white": "#f8fafc",
        "cosmic-blue": "#1e40af",
        "galaxy-purple": "#7c3aed",
      },
      fontFamily: {
        space: ["Orbitron", "monospace"],
        futura: ["Inter", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-slow": "bounce 3s infinite",
        twinkle: "twinkle 2s ease-in-out infinite",
        electric: "electric 0.3s ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": {
            boxShadow: "0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff",
          },
          "100%": {
            boxShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff",
          },
        },
        twinkle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        electric: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      backgroundImage: {
        starfield: "url('./assets/images/starfield.jpg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cosmic-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "nebula-gradient": "linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
