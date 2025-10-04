import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Tooltip,
} from "react-leaflet";
import { motion } from "framer-motion";
import { FaSatellite, FaGlobe, FaRocket, FaInfoCircle } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "leaflet/dist/images/marker-icon.png",
  shadowUrl: "leaflet/dist/images/marker-shadow.png",
});

// Custom satellite icon
const createSatelliteIcon = (color = "#00d4ff") => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 10px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
        </svg>
      </div>
    `,
    className: "custom-satellite-icon",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Custom exoplanet icon
const createExoplanetIcon = (color = "#8b5cf6") => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 8px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="12" r="8"/>
        </svg>
      </div>
    `,
    className: "custom-exoplanet-icon",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const MapComponent = ({
  type = "satellites",
  data = [],
  title = "Space Objects Map",
  height = 400,
  className = "",
}) => {
  const [map, setMap] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

  // Default center coordinates (NASA Headquarters)
  const defaultCenter = [38.8833, -77.0167];
  const defaultZoom = 2;

  // Get icon based on type
  const getIcon = (item, index) => {
    const colors = ["#00d4ff", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
    const color = colors[index % colors.length];

    if (type === "satellites") {
      return createSatelliteIcon(color);
    } else if (type === "exoplanets") {
      return createExoplanetIcon(color);
    }
    return createSatelliteIcon(color);
  };

  // Get popup content
  const getPopupContent = (item) => {
    if (type === "satellites") {
      return (
        <div className="p-4 bg-space-dark text-star-white rounded-lg min-w-[250px]">
          <div className="flex items-center space-x-2 mb-3">
            <FaSatellite className="text-neon-blue" />
            <h3 className="font-space font-bold text-lg text-gradient">
              {item.name}
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span
                className={`font-medium ${
                  item.status === "active"
                    ? "text-neon-green"
                    : item.status === "inactive"
                    ? "text-gray-400"
                    : "text-neon-purple"
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-star-white">{item.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Altitude:</span>
              <span className="text-neon-blue">{item.altitude} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Launch Date:</span>
              <span className="text-star-white">{item.launchDate}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedObject(item)}
            className="mt-3 w-full px-3 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30 rounded-lg text-neon-blue hover:text-white transition-all duration-300 text-sm"
          >
            <FaInfoCircle className="inline mr-2" />
            View Details
          </button>
        </div>
      );
    } else if (type === "exoplanets") {
      return (
        <div className="p-4 bg-space-dark text-star-white rounded-lg min-w-[250px]">
          <div className="flex items-center space-x-2 mb-3">
            <FaGlobe className="text-neon-purple" />
            <h3 className="font-space font-bold text-lg text-gradient">
              {item.name}
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-star-white">{item.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mass:</span>
              <span className="text-neon-green">
                {item.mass.toFixed(2)} Earth masses
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Temperature:</span>
              <span className="text-red-400">{item.temperature}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Distance:</span>
              <span className="text-neon-blue">
                {item.distance.toFixed(1)} ly
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Habitable:</span>
              <span
                className={item.habitable ? "text-neon-green" : "text-red-400"}
              >
                {item.habitable ? "Yes" : "No"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedObject(item)}
            className="mt-3 w-full px-3 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg text-neon-purple hover:text-white transition-all duration-300 text-sm"
          >
            <FaInfoCircle className="inline mr-2" />
            View Details
          </button>
        </div>
      );
    }
    return null;
  };

  // Get coordinates for different types
  const getCoordinates = (item) => {
    if (type === "satellites") {
      // For satellites, use orbital position or ground track
      return (
        item.coordinates || [
          Math.random() * 180 - 90,
          Math.random() * 360 - 180,
        ]
      );
    } else if (type === "exoplanets") {
      // For exoplanets, use star coordinates (simplified)
      return (
        item.coordinates || [
          Math.random() * 180 - 90,
          Math.random() * 360 - 180,
        ]
      );
    }
    return [0, 0];
  };

  // Custom tile layer for space theme
  const CustomTileLayer = () => (
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      className="space-tile-layer"
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`map-container bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Map Title */}
      <div className="absolute top-4 left-4 z-[1000] bg-space-dark/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-neon-blue/20">
        <h3 className="font-space font-bold text-neon-blue text-sm">{title}</h3>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-space-dark/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-neon-blue/20">
        <div className="flex items-center space-x-2 text-xs">
          {type === "satellites" ? (
            <>
              <div className="w-3 h-3 bg-neon-blue rounded-full"></div>
              <span className="text-star-white">Active</span>
              <div className="w-3 h-3 bg-gray-400 rounded-full ml-2"></div>
              <span className="text-star-white">Inactive</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-neon-purple rounded-full"></div>
              <span className="text-star-white">Exoplanets</span>
            </>
          )}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        whenCreated={setMap}
        className="space-map"
      >
        <CustomTileLayer />

        {/* Render markers */}
        {data.map((item, index) => {
          const coordinates = getCoordinates(item);
          if (!coordinates || coordinates.length !== 2) return null;

          return (
            <Marker
              key={item.id || index}
              position={coordinates}
              icon={getIcon(item, index)}
            >
              <Popup maxWidth={300} className="custom-popup">
                {getPopupContent(item)}
              </Popup>

              {/* Add tooltip */}
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <div className="text-center">
                  <div className="font-semibold text-neon-blue">
                    {item.name}
                  </div>
                  {type === "satellites" && (
                    <div className="text-xs text-gray-300">{item.type}</div>
                  )}
                  {type === "exoplanets" && (
                    <div className="text-xs text-gray-300">
                      {item.type} • {item.distance.toFixed(1)} ly
                    </div>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        })}

        {/* Add coverage circles for satellites */}
        {type === "satellites" &&
          data.map((satellite, index) => {
            const coordinates = getCoordinates(satellite);
            if (!coordinates || satellite.status !== "active") return null;

            return (
              <Circle
                key={`circle-${satellite.id || index}`}
                center={coordinates}
                radius={satellite.coverageRadius || 2000000} // 2000km radius
                pathOptions={{
                  color: "#00d4ff",
                  fillColor: "#00d4ff",
                  fillOpacity: 0.1,
                  weight: 1,
                  opacity: 0.3,
                }}
              />
            );
          })}
      </MapContainer>

      {/* Object Details Modal */}
      {selectedObject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          onClick={() => setSelectedObject(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-space-dark border border-neon-blue/30 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-space font-bold text-gradient">
                {selectedObject.name}
              </h3>
              <button
                onClick={() => setSelectedObject(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {type === "satellites" ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`font-medium ${
                        selectedObject.status === "active"
                          ? "text-neon-green"
                          : "text-gray-400"
                      }`}
                    >
                      {selectedObject.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-star-white">
                      {selectedObject.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Altitude:</span>
                    <span className="text-neon-blue">
                      {selectedObject.altitude} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Launch Date:</span>
                    <span className="text-star-white">
                      {selectedObject.launchDate}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-star-white">
                      {selectedObject.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mass:</span>
                    <span className="text-neon-green">
                      {selectedObject.mass.toFixed(2)} Earth masses
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Temperature:</span>
                    <span className="text-red-400">
                      {selectedObject.temperature}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance:</span>
                    <span className="text-neon-blue">
                      {selectedObject.distance.toFixed(1)} light years
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MapComponent;
