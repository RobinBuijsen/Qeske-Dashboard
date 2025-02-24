import GaugeChart from "react-gauge-chart";

export const Meter1 = () => (
  <div className="flex flex-col items-center">
    <GaugeChart
      id="gauge-1"
      nrOfLevels={10}
      percent={152.66 / 350} 
      colors={["#2c3e50", "#8E44AD"]} 
      arcWidth={0.3}
      textColor="#FFFFFF"
      formatTextValue={() => "152.66"}
    />
    <span className="text-white font-bold mt-2">Verbruikte energie van het net (in Kwh)</span>
  </div>
);

export const Meter2 = () => (
  <div className="flex flex-col items-center">
    <GaugeChart
      id="gauge-2"
      nrOfLevels={10}
      percent={1.0} // 100%
      colors={["#2c3e50", "#27AE60"]} 
      arcWidth={0.3}
      textColor="#FFFFFF"
    />
    <span className="text-white font-bold mt-2">Zelf verbruikte zonne-energie</span>
  </div>
);

export const Meter3 = () => (
  <div className="flex flex-col items-center">
    <GaugeChart
      id="gauge-3"
      nrOfLevels={10}
      percent={0.24} // 24%
      colors={["#2c3e50", "#F39C12"]} 
      arcWidth={0.3}
      textColor="#FFFFFF"
    />
    <span className="text-white font-bold mt-2">Zelfvoorziening</span>
  </div>
);

export const Meter4 = () => (
  <div className="flex flex-col items-center">
    <GaugeChart
      id="gauge-4"
      nrOfLevels={10}
      percent={0.31} // 71%
      colors={["#2c3e50", "#2980B9"]} 
      arcWidth={0.3}
      textColor="#FFFFFF"
    />
    <span className="text-white font-bold mt-2">Koolstofarme energie verbruikt</span>
  </div>
);

export default function Meters() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Meter1 />
      <Meter2 />
      <Meter3 />
      <Meter4 />
    </div>
  );
}
