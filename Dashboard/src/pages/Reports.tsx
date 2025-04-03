import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import EnergyFlow from "../components/EnergyFlow"; 
import  Meters  from "../components/Meters"; 
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchEntities } from "../api/api";

Chart.register(...registerables);

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("dag");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [zelfvoorziening, setZelfvoorziening] = useState(0);
  const [koolstofarmeEnergie, setKoolstofarmeEnergie] = useState(0);
  const token = localStorage.getItem("token") || "";
  const [entities, setEntities] = useState<{ id: number; entity_id: string; name: string }[]>([]);

  // Dummy data voor verschillende periodes
  const dataPerDag = {
    labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"],
    datasets: [
      {
        label: "KWh",
        backgroundColor: "#F1C40F",
        borderColor: "#F1C40F",
        data: Array.from({ length: 31 }, () => Math.floor(Math.random() * 35) + 5),
        tension: 0.4,
      },
    ],
  };

  const dataPerWeek = {
    labels: ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"],
    datasets: [
      {
        label: "KWh",
        backgroundColor: "#F1C40F",
        borderColor: "#F1C40F",
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 300) + 100),
      },
    ],
  };

  const dataPerJaar = {
    labels: [
      "Januari", "Februari", "Maart", "April", "Mei", "Juni",
      "Juli", "Augustus", "September", "Oktober", "November", "December"
    ],
    datasets: [
      {
        label: "KWh",
        backgroundColor: "#F1C40F",
        borderColor: "#F1C40F",
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 90000) + 10000),
      },
    ],
  };

  useEffect(() => {

    const loadEntities = async () => {
      const res = await fetchEntities(token);
      setEntities(res);
    };
    loadEntities();
    
    // Simuleer een backend call om meterstanden en andere data op te halen
    const fetchData = async () => {
      const fetchedZelfvoorziening = 24; // Simulatie
      const fetchedKoolstofarmeEnergie = 31; // Simulatie

      setZelfvoorziening(fetchedZelfvoorziening);
      setKoolstofarmeEnergie(fetchedKoolstofarmeEnergie);
    };

    fetchData();
  }, []);

  const duurzaamheidsscore = zelfvoorziening + koolstofarmeEnergie;

  const handleWeekChange = (date: Date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1));
    const endOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 7));
    setSelectedDate(startOfWeek);
    console.log(`Selected week: ${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`);
  };

  return (
    <>
      <NavBar />
      <div className="bg-[#0E1E3D] min-h-screen text-white overflow-y-auto w-screen overflow-x-hidden">
        <div className="container mx-auto py-6">
          <div className="flex flex-col items-center pt-10">
            {/* Filters */}
            <div className="flex justify-between w-[1440px] px-6 mb-5 mt-[-10] space-x-4">
              <div className="flex space-x-4">
                <select
                  className="bg-gray-900 text-white px-4 py-2 rounded-md border border-yellow-500"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="dag">Per dag</option>
                  <option value="week">Per week</option>
                  <option value="jaar">Per jaar</option>
                </select>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    setSelectedDate(date);
                    if (selectedPeriod === "week" && date) {
                      handleWeekChange(date);
                    }
                  }}
                  dateFormat={selectedPeriod === "dag" ? "dd/MM/yyyy" : selectedPeriod === "week" ? "dd/MM/yyyy" : "yyyy"}
                  showWeekNumbers={selectedPeriod === "week"}
                  showYearPicker={selectedPeriod === "jaar"}
                  className="bg-gray-900 text-white px-2 py-2 rounded-md border border-yellow-500"
                />
              </div>
            </div>

            <div className="flex space-x-6">
              {/* Grafiek op basis van geselecteerde periode */}
              <div className="w-[700px] h-[550px] border border-yellow-500 rounded-lg p-6 bg-gray-900 flex flex-col justify-center items-center">
                <div className="text-lg font-bold mb-4">Duurzaamheidsscore: {duurzaamheidsscore}%</div>
                {selectedPeriod === "dag" && <Line data={dataPerDag} />}
                {selectedPeriod === "week" && <Bar data={dataPerWeek} />}
                {selectedPeriod === "jaar" && <Bar data={dataPerJaar} />}
              </div>

              {/* Energieflow vanuit bestaande component */}
              <div className="w-[450px] h-[550px] border border-yellow-500 rounded-lg p-4 bg-gray-900 flex flex-col justify-center items-center">
                <h2 className="text-xl font-bold mb-7">Energiedistributie</h2>
                <div className="w-full h-full scale-[1.3]">
                  <EnergyFlow />
                </div>
              </div>

              {/* Meters component */}
              <div className="w-[200px] h-[550px] border border-yellow-500 rounded-lg p-4 bg-gray-900 flex flex-col justify-center items-center">
                <h2 className="text-lg font-bold mb-1">Meterstanden</h2>
                <div className="flex flex-col space-y-4 text-xs">
                  <div className="flex flex-col items-center scale-[0.8]">
                  <Meters token={token} entities={entities} />
                  </div>
                  <div className="flex flex-col items-center scale-[0.8]">
                  <Meters token={token} entities={entities} />
                  </div>
                  <div className="flex flex-col items-center scale-[0.8]">
                  <Meters token={token} entities={entities} />
                  </div>
                  <div className="flex flex-col items-center scale-[0.8]">
                  <Meters token={token} entities={entities} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
