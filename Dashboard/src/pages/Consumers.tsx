import React from "react";
import NavBar from "../components/NavBar";
import { Bar } from "react-chartjs-2";
import { Chart, registerables, ChartOptions, BarControllerChartOptions } from "chart.js";

Chart.register(...registerables);

const Consumers: React.FC = () => {
  // Dummy data voor detailgebruik individuele apparaten
  const detailUsageData = {
    labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
    datasets: [
      {
        label: "Warmtepomp Links - Verwarmen",
        backgroundColor: "#8E44AD",
        data: [5, 8, 6, 10, 12, 8, 6, 4],
      },
      {
        label: "Warmtepomp Rechts - Verwarmen",
        backgroundColor: "#E74C3C",
        data: [6, 9, 7, 11, 14, 10, 7, 5],
      },
      {
        label: "Server Ruimte",
        backgroundColor: "#3498DB",
        data: [3, 5, 4, 6, 7, 5, 4, 3],
      },
      {
        label: "Verbruik inverters & laden batterijen",
        backgroundColor: "#F39C12",
        data: [2, 4, 3, 5, 6, 4, 3, 2],
      },
    ],
  };

  // Dummy data voor monitor totaal verbruik
  const totalUsageData = {
    labels: [
      "Warmtepomp Links - Verwarmen",
      "Warmtepomp Rechts - Verwarmen",
      "Server Ruimte",
      "Easee 1 Totaal verbruik",
      "Verbruik inverters & laden batterijen",
    ],
    datasets: [
      {
        label: "kWh",
        backgroundColor: ["#8E44AD", "#E74C3C", "#3498DB", "#2980B9", "#F39C12"],
        data: [45, 40, 30, 20, 10],
      },
    ],
  };

  const totalUsageOptions: ChartOptions<"bar"> & BarControllerChartOptions = {
    indexAxis: "y",
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "#444",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          display: false,
        },
        position: "left",
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  // Dummy data voor de bronnen tabel
  const sourcesData = [
    { source: "KWH Meter - Zonnepanelen Energie export", energy: "2,55 kWh", color: "#F39C12" },
    { source: "Totaal zonne-energie", energy: "2,55 kWh", color: "#F39C12" },
    { source: "Total Battery Discharge", energy: "0 kWh", color: "#3498DB" },
    { source: "Today Battery Charge", energy: "-0,1 kWh", color: "#C0392B" },
    { source: "P1 meter - Locht 44 Energie import tarief 1", energy: "92,02 kWh", color: "#2980B9" },
    { source: "P1 meter - Locht 44 Energie import tarief 2", energy: "198,78 kWh", color: "#2980B9" },
    { source: "P1 meter - Locht 44 Energie export tarief 1", energy: "-0 kWh", color: "#9B59B6" },
    { source: "Totaal net", energy: "290,8 kWh", color: "#16A085" },
  ];

  return (
    <>
      <NavBar />
      <div className="bg-[#0E1E3D] min-h-screen text-white overflow-y-auto w-screen">
        <div className="container mx-auto py-6">
          <div className="flex flex-col items-center pt-10">
            <div className="flex space-x-6">
              {/* Detailgebruik individuele apparaten */}
              <div className="w-[700px] h-[500px] border border-yellow-500 rounded-lg p-6 bg-gray-900 flex flex-col justify-center">
                <h2 className="text-xl font-bold mb-4">Detailgebruik individuele apparaten</h2>
                <Bar data={detailUsageData} />
              </div>

              {/* Bronnen tabel */}
              <div className="w-[700px] h-[500px] border border-yellow-500 rounded-lg p-6 bg-gray-900 flex flex-col justify-between">
                <h2 className="text-xl font-bold mb-4">Bronnen</h2>
                <table className="w-full border-collapse text-md">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left px-4 py-2">Bron</th>
                      <th className="text-right px-4 py-2">Energie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourcesData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="px-4 py-2 flex items-center">
                          <span
                            className="w-3 h-3 inline-block mr-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          {item.source}
                        </td>
                        <td className="px-4 py-2 text-right">{item.energy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monitor totaal verbruik */}
            <div className="w-[1420px] h-[550px] border border-yellow-500 rounded-lg p-6 mt-6 mb-10 bg-gray-900">
              <h2 className="text-xl font-bold mb-4">Monitor totaal verbruik van individuele apparaten</h2>
              <div className="w-full h-[450px]">
                <Bar data={totalUsageData} options={totalUsageOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Consumers;
