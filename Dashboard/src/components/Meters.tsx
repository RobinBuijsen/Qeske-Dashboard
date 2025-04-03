import { useEffect, useRef, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { jwtDecode } from "jwt-decode";
import { fetchEntityMeasurements, getChartEntities, setChartEntity } from "../api/api";

interface Props {
  token: string;
  entities: { id: number; entity_id: string; name: string }[];
}

interface DecodedToken {
  role: string;
}

const meterKeys = ["meter1", "meter2", "meter3", "meter4"] as const;
type MeterKey = typeof meterKeys[number];

export default function Meters({ token, entities }: Props) {
  const [assignedMeters, setAssignedMeters] = useState<Record<MeterKey, string | null>>({
    meter1: null,
    meter2: null,
    meter3: null,
    meter4: null,
  });
  const [meterValues, setMeterValues] = useState<Record<MeterKey, number>>({
    meter1: 0,
    meter2: 0,
    meter3: 0,
    meter4: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setIsAdmin(decoded.role === "admin");
    } catch {
      setIsAdmin(false);
    }
  }, [token]);

  useEffect(() => {
    const loadMeterAssignments = async () => {
      const res = await getChartEntities(token);
      setAssignedMeters((res?.meters || {}) as Record<MeterKey, string | null>);
    };
    loadMeterAssignments();
  }, [token]);

  const updateMeterAssignment = async (key: MeterKey, entity_id: string) => {
    try {
      await setChartEntity(entity_id, key, token);
      setAssignedMeters((prev) => ({ ...prev, [key]: entity_id }));
    } catch (err) {
      console.error("❌ Fout bij opslaan meter mapping:", err);
    }
  };

  const fetchMeterData = async () => {
    const updates: Partial<Record<MeterKey, number>> = {};

    for (const key of meterKeys) {
      const entity_id = assignedMeters[key];
      if (!entity_id) continue;

      const result = await fetchEntityMeasurements(entity_id, token);
      if (result?.W?.length > 0) {
        const laatste = result.W[result.W.length - 1];
        const waarde =
          laatste.waarde || laatste.value || laatste.stroomverbruik || laatste.power || 0;
        updates[key] = waarde;
      }
    }

    setMeterValues((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (!Object.values(assignedMeters).some(Boolean)) return;
    fetchMeterData();
    const interval = setInterval(fetchMeterData, 1800000); // 30 min
    return () => clearInterval(interval);
  }, [assignedMeters, token]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderMeter = (key: MeterKey, fallbackLabel: string, color: string, scaleMax = 100) => {
    const entity_id = assignedMeters[key];
    const entityName = entities.find((e) => e.entity_id === entity_id)?.name || fallbackLabel;

    return (
      <div key={key} className="flex flex-col items-center">
        <GaugeChart
          id={`gauge-${key}`}
          nrOfLevels={10}
          percent={Math.min(meterValues[key] / scaleMax, 1)}
          colors={["#2c3e50", color]}
          arcWidth={0.3}
          textColor="#FFFFFF"
          formatTextValue={() => `${meterValues[key].toFixed(2)} kWh`}
        />
        <span className="text-white font-bold mt-2">{entityName}</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      {isAdmin && (
        <div className="relative mb-4 flex justify-end" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-white text-2xl px-2 rounded hover:bg-yellow-400 hover:text-black"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 bg-white text-black rounded shadow-lg z-30 p-4 w-[300px] max-h-[400px] overflow-y-auto">
              <h4 className="font-bold mb-2">Meters toewijzen</h4>
              {meterKeys.map((key) => (
                <div key={key} className="mb-4">
                  <label className="font-semibold capitalize">{key}</label>
                  <select
                    value={assignedMeters[key] || ""}
                    onChange={(e) => updateMeterAssignment(key, e.target.value)}
                    className="w-full border border-gray-300 rounded mt-1"
                  >
                    <option value="">-- Geen --</option>
                    {entities.map((e) => (
                      <option key={e.id} value={e.entity_id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderMeter("meter1", "Verbruikte energie van het net (in kWh)", "#8E44AD", 350)}
        {renderMeter("meter2", "Zelf verbruikte zonne-energie", "#27AE60")}
        {renderMeter("meter3", "Zelfvoorziening", "#F39C12")}
        {renderMeter("meter4", "Koolstofarme energie verbruikt", "#2980B9")}
      </div>
    </div>
  );
}