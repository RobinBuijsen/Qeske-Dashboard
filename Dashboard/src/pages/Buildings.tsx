import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

const SENSOR_IDS = {
  "Wiebachstraat 36": {
    total: "p1_meter_wiebachstraat_36_vermogen",
    phase1: "p1_meter_wiebachstraat_36_vermogen_fase_1",
    phase2: "p1_meter_wiebachstraat_36_vermogen_fase_2",
    phase3: "p1_meter_wiebachstraat_36_vermogen_fase_3",
  },
  "Wiebachstraat 38": {
    total: "p1_meter_wiebachstraat_38_vermogen",
    phase1: "p1_meter_wiebachstraat_38_vermogen_fase_1",
    phase2: "p1_meter_wiebachstraat_38_vermogen_fase_2",
    phase3: "p1_meter_wiebachstraat_38_vermogen_fase_3",
  },
  "Locht 42": {
    total: "p1_meter_locht_42_vermogen",
    phase1: "p1_meter_locht_42_vermogen_fase_1",
    phase2: "p1_meter_locht_42_vermogen_fase_2",
    phase3: "p1_meter_locht_42_vermogen_fase_3",
  },
  "Locht 44": {
    total: "p1_meter_locht_44_vermogen",
    phase1: "p1_meter_locht_44_vermogen_fase_1",
    phase2: "p1_meter_locht_44_vermogen_fase_2",
    phase3: "p1_meter_locht_44_vermogen_fase_3",
  },
};

interface BuildingData {
  name: string;
  currentUsage: number;
  min: number;
  max: number;
  phases: number[];
}

const fetchStats = async (): Promise<Record<string, any>> => {
  const entity_ids = Object.values(SENSOR_IDS).flatMap(obj => Object.values(obj));
  const res = await fetch("http://localhost:3000/api/entities/stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ entity_ids }),
  });

  if (!res.ok) {
    console.error("Failed to fetch building stats");
    return {};
  }

  return await res.json();
};

const round = (val: number | undefined | null): number => parseFloat((val ?? 0).toFixed(1));

const ConsumptionBuildings: React.FC = () => {
  const [buildingStats, setBuildingStats] = useState<BuildingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const stats = await fetchStats();

      const updated = Object.entries(SENSOR_IDS).map(([name, sensors]) => {
        const total = stats[sensors.total] ?? {};
        return {
          name,
          currentUsage: round(total.last),
          min: round(total.min),
          max: round(total.max),
          phases: [
            round(stats[sensors.phase1]?.last),
            round(stats[sensors.phase2]?.last),
            round(stats[sensors.phase3]?.last)
          ]
        };
      });

      setBuildingStats(updated);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBar />
      <div className="bg-[#0E1E3D] min-h-screen text-white relative">
        <div className="absolute top-10 left-1">
          <Link to="/energyflow">
            <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold hover:bg-yellow-600 text-sm">
              ← Terug
            </button>
          </Link>
        </div>

        <div className="flex flex-col items-center pt-16 mt-10">
          {loading ? (
            <p className="text-white text-xl">Laden...</p>
          ) : (
            <div className="flex space-x-6">
              {buildingStats.map((building, index) => (
                <div
                  key={index}
                  className="w-[300px] bg-gray-900 p-6 rounded-lg border border-yellow-500 flex flex-col justify-center"
                >
                  <h2 className="text-lg font-bold text-center mb-4">{building.name}</h2>
                  <div className="text-center text-2xl font-bold text-yellow-400">
                    {building.currentUsage?.toLocaleString?.() ?? '–'} W
                  </div>
                  <div className="text-sm text-center mt-2">
                    Min: {building.min?.toLocaleString?.() ?? '–'} W - Max: {building.max?.toLocaleString?.() ?? '–'} W
                  </div>

                  <div className="flex justify-between mt-4 text-center">
                    <div className="w-1/3">
                      <h3 className="text-sm font-bold text-blue-400">Fase 1</h3>
                      <div className="text-lg">{building.phases[0]?.toLocaleString?.() ?? '–'} W</div>
                    </div>
                    <div className="w-1/3">
                      <h3 className="text-sm font-bold text-blue-400">Fase 2</h3>
                      <div className="text-lg">{building.phases[1]?.toLocaleString?.() ?? '–'} W</div>
                    </div>
                    <div className="w-1/3">
                      <h3 className="text-sm font-bold text-blue-400">Fase 3</h3>
                      <div className="text-lg">{building.phases[2]?.toLocaleString?.() ?? '–'} W</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsumptionBuildings;
