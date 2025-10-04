import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Line, Bar, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const ChartComponent = ({
  type = "line",
  data,
  title,
  height = 400,
  animation = true,
  className = "",
}) => {
  const chartRef = useRef(null);

  // Default chart options with space theme
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#f8fafc",
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        color: "#00d4ff",
        font: {
          family: "Orbitron, monospace",
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "rgba(26, 26, 26, 0.9)",
        titleColor: "#00d4ff",
        bodyColor: "#f8fafc",
        borderColor: "#00d4ff",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          family: "Orbitron, monospace",
          weight: "bold",
        },
        bodyFont: {
          family: "Inter, sans-serif",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 212, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 212, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
    },
    animation: animation
      ? {
          duration: 2000,
          easing: "easeInOutQuart",
        }
      : false,
  };

  // Space-themed color palette
  const spaceColors = {
    primary: "#00d4ff",
    secondary: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#06b6d4",
    purple: "#a855f7",
    pink: "#ec4899",
  };

  // Process data to include space theme colors
  const processData = (rawData) => {
    if (!rawData) return null;

    const processedData = { ...rawData };

    // Apply space theme colors to datasets
    if (processedData.datasets) {
      processedData.datasets = processedData.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor:
          dataset.borderColor ||
          Object.values(spaceColors)[index % Object.values(spaceColors).length],
        backgroundColor:
          dataset.backgroundColor ||
          (type === "doughnut" || type === "polarArea"
            ? Object.values(spaceColors)[
                index % Object.values(spaceColors).length
              ] + "40"
            : Object.values(spaceColors)[
                index % Object.values(spaceColors).length
              ] + "20"),
        pointBackgroundColor:
          dataset.pointBackgroundColor ||
          Object.values(spaceColors)[index % Object.values(spaceColors).length],
        pointBorderColor: dataset.pointBorderColor || "#ffffff",
        pointBorderWidth: dataset.pointBorderWidth || 2,
        pointRadius: dataset.pointRadius || 4,
        pointHoverRadius: dataset.pointHoverRadius || 6,
        borderWidth: dataset.borderWidth || 2,
        tension: dataset.tension || 0.4,
      }));
    }

    return processedData;
  };

  const renderChart = () => {
    const processedData = processData(data);
    if (!processedData) return null;

    const commonProps = {
      ref: chartRef,
      data: processedData,
      options: defaultOptions,
    };

    switch (type) {
      case "line":
        return <Line {...commonProps} />;
      case "bar":
        return <Bar {...commonProps} />;
      case "doughnut":
        return <Doughnut {...commonProps} />;
      case "radar":
        return <Radar {...commonProps} />;
      case "polarArea":
        return <PolarArea {...commonProps} />;
      default:
        return <Line {...commonProps} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`chart-container bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 ${className}`}
      style={{ height: `${height}px` }}
    >
      {renderChart()}
    </motion.div>
  );
};

// Predefined chart configurations for common NASA data
export const MissionTimelineChart = ({ missions }) => {
  const data = {
    labels: missions?.map((mission) => mission.year) || [],
    datasets: [
      {
        label: "Missions Launched",
        data: missions?.map((mission) => mission.count) || [],
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <ChartComponent
      type="line"
      data={data}
      title="NASA Mission Timeline"
      height={400}
    />
  );
};

export const ExoplanetTypeChart = ({ exoplanets }) => {
  const typeCounts =
    exoplanets?.reduce((acc, planet) => {
      acc[planet.type] = (acc[planet.type] || 0) + 1;
      return acc;
    }, {}) || {};

  const data = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        data: Object.values(typeCounts),
        backgroundColor: [
          "#00d4ff40",
          "#8b5cf640",
          "#10b98140",
          "#f59e0b40",
          "#ef444440",
          "#06b6d440",
          "#a855f740",
          "#ec489940",
        ],
        borderColor: [
          "#00d4ff",
          "#8b5cf6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#06b6d4",
          "#a855f7",
          "#ec4899",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <ChartComponent
      type="doughnut"
      data={data}
      title="Exoplanet Types Distribution"
      height={400}
    />
  );
};

export const SatelliteStatusChart = ({ satellites }) => {
  const statusCounts =
    satellites?.reduce((acc, satellite) => {
      acc[satellite.status] = (acc[satellite.status] || 0) + 1;
      return acc;
    }, {}) || {};

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Number of Satellites",
        data: Object.values(statusCounts),
        backgroundColor: ["#10b98140", "#f59e0b40", "#8b5cf640", "#ef444440"],
        borderColor: ["#10b981", "#f59e0b", "#8b5cf6", "#ef4444"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <ChartComponent
      type="bar"
      data={data}
      title="Satellite Status Distribution"
      height={400}
    />
  );
};

export const TemperatureChart = ({ exoplanets }) => {
  const data = {
    labels:
      exoplanets
        ?.filter((planet) => planet.pl_eqt)
        .map((planet) => planet.pl_name) || [],
    datasets: [
      {
        label: "Surface Temperature (°C)",
        data:
          exoplanets
            ?.filter((planet) => planet.pl_eqt)
            .map((planet) => planet.pl_eqt) || [],
        borderColor: "#ef4444",
        backgroundColor: "#ef444420",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <ChartComponent
      type="line"
      data={data}
      title="Exoplanet Surface Temperatures"
      height={400}
    />
  );
};

export const MassComparisonChart = ({ exoplanets }) => {
  const data = {
    labels:
      exoplanets
        ?.filter((planet) => planet.pl_masse)
        .map((planet) => planet.pl_name) || [],
    datasets: [
      {
        label: "Mass (Earth Masses)",
        data:
          exoplanets
            ?.filter((planet) => planet.pl_masse)
            .map((planet) => planet.pl_masse || 0) || [],
        backgroundColor: "#00d4ff40",
        borderColor: "#00d4ff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <ChartComponent
      type="bar"
      data={data}
      title="Exoplanet Mass Comparison"
      height={400}
    />
  );
};

export const DiscoveryMethodChart = ({ exoplanets }) => {
  const methodCounts =
    exoplanets?.reduce((acc, planet) => {
      acc[planet.discoverymethod] = (acc[planet.discoverymethod] || 0) + 1;
      return acc;
    }, {}) || {};

  const data = {
    labels: Object.keys(methodCounts),
    datasets: [
      {
        data: Object.values(methodCounts),
        backgroundColor: [
          "#00d4ff40",
          "#8b5cf640",
          "#10b98140",
          "#f59e0b40",
          "#ef444440",
          "#06b6d440",
        ],
        borderColor: [
          "#00d4ff",
          "#8b5cf6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#06b6d4",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <ChartComponent
      type="polarArea"
      data={data}
      title="Exoplanet Discovery Methods"
      height={400}
    />
  );
};

export default ChartComponent;
