import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ title }: { title: string }) {
  const data = {
    labels: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
    datasets: [
      {
        label: title,
        data: [400, 500, 600, 700, 800, 750],
        backgroundColor: "rgba(255, 215, 0, 0.8)", // Gele kleur
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title, color: "white" },
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } },
    },
  };

  return (
    <div className="w-full h-[350px] flex flex-col justify-center"> {/* Adjusted height */}
      <h3 className="text-center font-bold text-lg mb-4">{title}</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
