import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js componenten
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PVPanelChart: React.FC = () => {
  const data = {
    labels: ["00:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
    datasets: [
      {
        label: "Opbrengst (W)",
        data: [0, 50, 1200, 3300, 2500, 800, 0],
        borderColor: "yellow",
        backgroundColor: "rgba(255, 215, 0, 0.5)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.raw} W`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        grid: {
          color: "#ffffff22",
        },
        ticks: {
          color: "#ffffff",
          callback: function (tickValue: string | number) {
            return `${tickValue} W`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-[#0E1E3D] p-4 rounded-lg w-full border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-2">Zonnepanelen</h2>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>

      {/* Inverters */}
      <div className="flex justify-around mt-4 text-white space-x-4">
        <div className="bg-[#091630] p-4 rounded-lg w-1/3 flex flex-col items-center border border-yellow-500">
          <span className="text-yellow-400 text-2xl">⚡</span>
          <span className="font-bold">Inverter 1</span>
          <span className="text-sm">0 W</span>
        </div>
        <div className="bg-[#091630] p-4 rounded-lg w-1/3 flex flex-col items-center border border-yellow-500">
          <span className="text-yellow-400 text-2xl">⚡</span>
          <span className="font-bold">Inverter 2</span>
          <span className="text-sm">1.698 W</span>
        </div>
        <div className="bg-[#091630] p-4 rounded-lg w-1/3 flex flex-col items-center border border-yellow-500">
          <span className="text-yellow-400 text-2xl">⚡</span>
          <span className="font-bold">Inverter 3</span>
          <span className="text-sm">0 W</span>
        </div>
      </div>
    </div>
  );
};

export default PVPanelChart;
