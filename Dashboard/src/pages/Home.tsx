import { useEffect, useState } from "react";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import Meters from "../components/Meters";
import NavBar from "../components/NavBar";
import {
  fetchEntities,
  getChartEntities,
  setChartEntity,
  Entity as EntityType,
} from "../api/api";

export default function Home() {
  const token = localStorage.getItem("token") || "";
  const [entities, setEntities] = useState<EntityType[]>([]);
  const [selectedTop, setSelectedTop] = useState<string>("");
  const [selectedBottom, setSelectedBottom] = useState<string>("");

  useEffect(() => {
    const loadEntities = async () => {
      const data = await fetchEntities(token);
      if (!Array.isArray(data)) return;

      setEntities(data);

      const chartData = await getChartEntities(token);
      const fallback = data.length > 0 ? data[0].entity_id : "";

      if (chartData?.top?.entity_id) {
        setSelectedTop(chartData.top.entity_id);
      } else {
        setSelectedTop(fallback);
      }

      if (chartData?.bottom?.entity_id) {
        setSelectedBottom(chartData.bottom.entity_id);
      } else {
        setSelectedBottom(fallback);
      }
    };

    loadEntities();
  }, [token]);

  const handleSelectTop = async (entity_id: string) => {
    setSelectedTop(entity_id);
    try {
      await setChartEntity(entity_id, "top", token);
    } catch (error) {
      console.error("❌ Fout bij opslaan top grafiekentiteit:", error);
    }
  };

  const handleSelectBottom = async (entity_id: string) => {
    setSelectedBottom(entity_id);
    try {
      await setChartEntity(entity_id, "bottom", token);
    } catch (error) {
      console.error("❌ Fout bij opslaan bottom grafiekentiteit:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-[#0E1E3D] text-white min-h-screen pt-[70px] overflow-y-auto w-screen px-8">
        <h2 className="text-xl font-bold mb-4">Energie Dashboard</h2>

        <div className="grid grid-cols-2 gap-4 w-full max-w-none auto-rows-[500px]">
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              {selectedTop && (
                <BarChart
                  title={`Energieverbruik: ${selectedTop}`}
                  entity_id={selectedTop}
                  token={token}
                  entities={entities}
                  onSelect={handleSelectTop}
                />
              )}
            </div>
          </div>
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              <PieChart token={token} entities={entities}/>
            </div>
          </div>
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              {selectedBottom && (
                <BarChart
                  title={`Totaal energie productie: ${selectedBottom}`}
                  entity_id={selectedBottom}
                  token={token}
                  entities={entities}
                  onSelect={handleSelectBottom}
                />
              )}
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
