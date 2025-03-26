import { useEffect, useRef, useState } from "react";
import { fetchEntityMeasurements } from "../api/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { jwtDecode } from "jwt-decode";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  title: string;
  entity_id: string;
  token: string;
  entities?: { id: number; entity_id: string; name: string }[];
  onSelect?: (id: string) => void;
}

interface DataPoint {
  tijd: string;
  waarde: number;
}

interface DecodedToken {
  role: string;
}

export default function BarChart({ title, entity_id, token, entities, onSelect }: Props) {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setIsAdmin(decoded.role === "admin");
    } catch (e) {
      setIsAdmin(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchAndFormat = async () => {
      setLoading(true);
      try {
        const result = await fetchEntityMeasurements(entity_id, token);
        console.log("📊 Response van Influx voor grafiek:", result);
        if (result && result.W) {
          const entries = result.W;
          const formatted: DataPoint[] = entries.map((entry: any): DataPoint => ({
            tijd: new Date(entry.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            waarde: entry.waarde || entry.value || entry.stroomverbruik || entry.power || 0,
          }));
          const sliced = formatted.slice(-8);
          setLabels(sliced.map((e) => e.tijd));
          setValues(sliced.map((e) => e.waarde));
        }
      } catch (error) {
        console.error("❌ Fout bij ophalen meetgegevens:", error);
      }
      setLoading(false);
    };

    fetchAndFormat();
    const interval = setInterval(fetchAndFormat, 30 * 1000);
    return () => clearInterval(interval);
  }, [entity_id, token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: "rgba(255, 215, 0, 0.8)",
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

  if (loading) return <p className="text-white">Laden...</p>;

  return (
    <div className="w-full h-[350px] relative flex flex-col justify-center">
      {isAdmin && entities && onSelect && (
        <div className="absolute top-2 right-2 z-20" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-white text-2xl px-2 rounded hover:bg-yellow-400 hover:text-black"
          >
            ⋮
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-[220px] bg-white text-black rounded shadow-lg z-30">
              {entities.map((e) => (
                <button
                  key={e.id}
                  className="block w-full text-left px-4 py-2 hover:bg-yellow-200"
                  onClick={() => {
                    setShowMenu(false);
                    onSelect(e.entity_id);
                  }}
                >
                  {e.name} ({e.entity_id})
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <h3 className="text-center font-bold text-lg mb-4">{title}</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
