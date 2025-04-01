import { useEffect, useRef, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchEntityMeasurements } from "../api/api";
import { jwtDecode } from "jwt-decode";
import { getPieChartEntities, setPieChartEntities } from "../api/api";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  token: string;
  entities: {
    id: number;
    entity_id: string;
    name: string;
  }[];
}

interface DecodedToken {
  role: string;
}

export default function PieChart({ token, entities }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSelected = async () => {
      const response = await getPieChartEntities(token);
      if (Array.isArray(response)) {
        setSelectedIds(response);
      }
    };
    loadSelected();
  }, [token]);

  useEffect(() => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setIsAdmin(decoded.role === "admin");
    } catch {
      setIsAdmin(false);
    }
  }, [token]);

  const loadData = async (ids: string[], token: string) => {
    const values: { name: string; value: number }[] = [];

    for (const id of ids) {
      const entity = entities.find((e) => e.entity_id === id);
      if (!entity) continue;

      const result = await fetchEntityMeasurements(id, token);
      if (result?.W?.length > 0) {
        const last = result.W[result.W.length - 1];
        const waarde =
          last.waarde || last.value || last.stroomverbruik || last.power || 0;

        values.push({ name: entity.name, value: waarde });
      }
    }

    const total = values.reduce((sum, e) => sum + e.value, 0);
    const data = {
      labels: values.map((e) => e.name),
      datasets: [
        {
          label: "% verbruik",
          data: values.map((e) =>
            total > 0 ? parseFloat(((e.value / total) * 100).toFixed(2)) : 0
          ),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#9F058F", "#4BC0C0",
            "#8E44AD", "#27AE60", "#E67E22", "#2980B9", "#D35400",
          ],
          hoverOffset: 4,
        },
      ],
    };

    setChartData(data);
  };

  useEffect(() => {
    if (!selectedIds || selectedIds.length === 0) return;

    loadData(selectedIds, token);

    const interval = setInterval(() => {
      loadData(selectedIds, token);
    }, 1800000); // 30 minuten

    return () => clearInterval(interval);
  }, [selectedIds, token]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = async (id: string) => {
    if (!selectedIds) return;

    const updated = selectedIds.includes(id)
      ? selectedIds.filter((e) => e !== id)
      : [...selectedIds, id];

    setSelectedIds(updated);

    try {
      await setPieChartEntities(updated, token);
    } catch (error) {
      console.error("Fout bij opslaan selectie piechart:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      {isAdmin && (
        <div className="absolute top-2 right-2 z-20" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-white text-2xl px-2 rounded hover:bg-yellow-400 hover:text-black"
          >
            ⋮
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-[250px] bg-white text-black rounded shadow-lg z-30 p-2 max-h-[250px] overflow-y-auto">
              <h4 className="font-semibold mb-2">Selecteer entiteiten</h4>
              {entities.map((entity) => (
                <label key={entity.id} className="flex items-center gap-2 text-sm mb-1">
                  <input
                    type="checkbox"
                    className="accent-yellow-400"
                    checked={selectedIds?.includes(entity.entity_id) || false}
                    onChange={() => toggleSelect(entity.entity_id)}
                  />
                  {entity.name}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <h3 className="text-center font-bold text-lg mb-2">% verbruikers van totaal</h3>

      <div className="w-full h-[350px] flex flex-col justify-center">
        {chartData ? (
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: "#ffffff",
                  },
                },
              },
            }}
          />
        ) : (
          <p className="text-white text-center">Selecteer entiteiten om data te tonen</p>
        )}
      </div>
    </div>
  );
}
