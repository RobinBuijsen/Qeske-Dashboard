import React, { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SENSOR_IDS = {
  totalPv: "zonnepanelen_opbrengst_totaal",
  inverter1: "inverter_1_huidig",
  inverter2: "inverter_2_huidig",
  inverter3: "inverter_3_huidig",
};

const fetchSensorValues = async () => {
  const res = await fetch("http://localhost:3000/api/entities/values", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ entity_ids: Object.values(SENSOR_IDS) }),
  });

  if (!res.ok) {
    console.error("Failed to fetch sensor values");
    return null;
  }
  return await res.json();
};

const PVPanelChart: React.FC = () => {
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [inverterData, setInverterData] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetchSensorValues();
      if (!data) return;

      setChartData(prev => {
        const newVal = data[SENSOR_IDS.totalPv] ?? 0;
        const trimmed = [...prev.slice(1), parseFloat(newVal.toFixed(2))];
        return trimmed;
      });

      setInverterData({
        [SENSOR_IDS.inverter1]: parseFloat((data[SENSOR_IDS.inverter1] ?? 0).toFixed(2)),
        [SENSOR_IDS.inverter2]: parseFloat((data[SENSOR_IDS.inverter2] ?? 0).toFixed(2)),
        [SENSOR_IDS.inverter3]: parseFloat((data[SENSOR_IDS.inverter3] ?? 0).toFixed(2)),
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      const data = await fetchSensorValues();
      if (!data) return;
  
      setChartData(prev => {
        const newVal = data[SENSOR_IDS.totalPv] ?? 0;
        const trimmed = [...prev.slice(1), parseFloat(newVal.toFixed(2))];
        return trimmed;
      });
  
      setInverterData({
        [SENSOR_IDS.inverter1]: parseFloat((data[SENSOR_IDS.inverter1] ?? 0).toFixed(2)),
        [SENSOR_IDS.inverter2]: parseFloat((data[SENSOR_IDS.inverter2] ?? 0).toFixed(2)),
        [SENSOR_IDS.inverter3]: parseFloat((data[SENSOR_IDS.inverter3] ?? 0).toFixed(2)),
      });
    };
  
    fetchAndUpdate();
  
    const interval = setInterval(fetchAndUpdate, 60000);
    return () => clearInterval(interval);
  }, []);
  

  const data = {
    labels: ["00:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
    datasets: [
      {
        label: "Opbrengst (W)",
        data: chartData,
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

      <div className="flex justify-around mt-4 text-white space-x-4">
        {[SENSOR_IDS.inverter1, SENSOR_IDS.inverter2, SENSOR_IDS.inverter3].map((id, i) => (
          <div key={id} className="bg-[#091630] p-4 rounded-lg w-1/3 flex flex-col items-center border border-yellow-500">
            <span className="text-yellow-400 text-2xl">⚡</span>
            <span className="font-bold">Inverter {i + 1}</span>
            <span className="text-sm">{inverterData[id] ?? 0} W</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PVPanelChart;