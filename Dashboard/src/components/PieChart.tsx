import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const data = {
    labels: ["Warmtepomp links", "Warmtepomp rechts", "Easee", "Server ruimte", "Overige apparaten"],
    datasets: [
      {
        label: "verbruik",
        data: [19, 16, 10, 15, 40],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#9F058F", "#4BC0C0"],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
        <h3 className="text-center font-bold text-lg">% verbruikers van totaal</h3> 
        <div className="w-full h-[350px] flex flex-col justify-center"> {/* Adjusted height */}'
        <Pie data={data} options={options} />
            </div>	
    </div>
  );
}
