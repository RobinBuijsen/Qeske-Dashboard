import { useEffect, useState } from "react";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import Meters from "../components/Meters";
import NavBar from "../components/NavBar";
import { fetchEntities } from "../api/api";

interface Entity {
  id: number;
  entity_id: string;
  name: string;
}

export default function Home() {
  const token = localStorage.getItem("token") || "";
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const loadEntities = async () => {
      const data = await fetchEntities(token);
      if (Array.isArray(data) && data.length > 0) {
        setEntities(data);
        setSelected(data[0].entity_id);
      }
    };

    loadEntities();
  }, [token]);

  return (
    <>
      <NavBar />
      <div className="bg-[#0E1E3D] text-white min-h-screen pt-[70px] overflow-y-auto w-screen px-8">
        <h2 className="text-xl font-bold mb-4">Energie Dashboard</h2>

        <div className="grid grid-cols-2 gap-4 w-full max-w-none auto-rows-[500px]">
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              {selected && (
                <BarChart
                  title={`Energieverbruik: ${selected}`}
                  entity_id={selected}
                  token={token}
                  entities={entities}
                  onSelect={(id) => setSelected(id)}
                />
              )}
            </div>
          </div>
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              <PieChart />
            </div>
          </div>
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              <BarChart
                title="Totaal energie productie nu"
                token={token}
                entity_id="pv1_power_2"
              />
            </div>
          </div>
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              <Meters />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
