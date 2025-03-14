import { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { fetchMeterData } from "../api/influxService";

export default function Meters() {
  const [powerUsage, setPowerUsage] = useState({
    meter1: 0,  // Verbruikte energie van het net
    meter2: 0,  // Zelf verbruikte zonne-energie
    meter3: 0,  // Zelfvoorziening
    meter4: 0,  // Koolstofarme energie
  });

  useEffect(() => {
    async function getData() {
      const result = await fetchMeterData();
      if (result) {
        setPowerUsage({
          meter1: result.verbruikteEnergie || 0, 
          meter2: Math.min(result.zelfVerbruikZon || 0, 100), // Max 100%
          meter3: Math.min(result.zelfVoorziening || 0, 100), // Max 100%
          meter4: Math.min(result.co2 || 0, 100) // Max 100%
        });
      }
    }
    getData();
    const interval = setInterval(getData, 60000); // Update elke 1 minuut
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Meter1 value={powerUsage.meter1} />
      <Meter2 value={powerUsage.meter2} />
      <Meter3 value={powerUsage.meter3} />
      <Meter4 value={powerUsage.meter4} />
    </div>
  );
}

export const Meter1 = ({ value }: { value: number }) => (
  <div className="flex flex-col items-center">
    <GaugeChart
      id="gauge-1"
      nrOfLevels={10}
      percent={Math.min(value / 350, 1)} 
      colors={["#2c3e50", "#8E44AD"]}
      arcWidth={0.3}
      textColor="#FFFFFF"
      formatTextValue={() => `${value.toFixed(2)} kWh`}
    />
    <span className="text-white font-bold mt-2">Verbruikte energie van het net (in kWh)</span>
  </div>
);

export const Meter2 = ({ value }: { value: number }) => (
  <div className="flex flex-col items-center">
    <GaugeChart
      id="gauge-2"
      nrOfLevels={10}
      percent={value / 100}
      colors={["#2c3e50", "#27AE60"]}
      arcWidth={0.3}
      textColor="#FFFFFF"
      formatTextValue={() => `${value.toFixed(2)}%`}
    />
    <span className="text-white font-bold mt-2">Zelf verbruikte zonne-energie</span>
  </div>
);

export const Meter3 = ({ value }: { value: number }) => (
  <div className="flex flex-col items-center">
    <GaugeChart
      id="gauge-3"
      nrOfLevels={10}
      percent={value / 100}
      colors={["#2c3e50", "#F39C12"]}
      arcWidth={0.3}
      textColor="#FFFFFF"
      formatTextValue={() => `${value.toFixed(2)}%`}
    />
    <span className="text-white font-bold mt-2">Zelfvoorziening</span>
  </div>
);

export const Meter4 = ({ value }: { value: number }) => (
  <div className="flex flex-col items-center">
    <GaugeChart
      id="gauge-4"
      nrOfLevels={10}
      percent={value / 100}
      colors={["#2c3e50", "#2980B9"]}
      arcWidth={0.3}
      textColor="#FFFFFF"
      formatTextValue={() => `${value.toFixed(2)}%`}
    />
    <span className="text-white font-bold mt-2">Koolstofarme energie verbruikt</span>
  </div>
);
