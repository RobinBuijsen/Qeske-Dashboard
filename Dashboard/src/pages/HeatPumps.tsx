import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

interface SensorStats {
  min: number;
  max: number;
  mean: number;
  last: number;
}

const SENSOR_IDS = {
  leftPump: "climatecontrol_leaving_water_temperature",
  rightPump: "climatecontrol_leaving_water_temperature_2",
  roomGround: "climatecontrol_room_temperature",
  roomFirst: "climatecontrol_room_temperature_2",
  humidityGround: "lumi_lumi_weather_humidity",
  humidityFirst: "lumi_lumi_weather_humidity_2",
};

const fetchSensorValues = async (): Promise<Record<string, SensorStats>> => {
  const res = await fetch("http://localhost:3000/api/entities/stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ entity_ids: Object.values(SENSOR_IDS) }),
  });

  if (!res.ok) {
    console.error("Failed to fetch sensor stats");
    return {};
  }

  return await res.json();
};



const round = (val: number | undefined | null): number => parseFloat((val ?? 0).toFixed(1));

const HeatPumps: React.FC = () => {
  const [data, setData] = useState<Record<string, any>>({});

  const fetchAndUpdate = async () => {
    const stats = await fetchSensorValues();
    if (stats) setData(stats);
  };

  useEffect(() => {
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRoom = (floor: "roomGround" | "roomFirst") => ({
    current: round(data[SENSOR_IDS[floor]]?.last),
    min: round(data[SENSOR_IDS[floor]]?.min),
    max: round(data[SENSOR_IDS[floor]]?.max),
  });

  const getHumidity = (floor: "humidityGround" | "humidityFirst") => ({
    current: round(data[SENSOR_IDS[floor]]?.last),
    min: round(data[SENSOR_IDS[floor]]?.min),
    max: round(data[SENSOR_IDS[floor]]?.max),
  });

  const getPump = (side: "leftPump" | "rightPump") => ({
    current: round(data[SENSOR_IDS[side]]?.last),
    min: round(data[SENSOR_IDS[side]]?.min),
    max: round(data[SENSOR_IDS[side]]?.max),
    avg: round(data[SENSOR_IDS[side]]?.mean),
  });

  const roomData = {
    groundFloor: getRoom("roomGround"),
    firstFloor: getRoom("roomFirst"),
    average: {
      current: round((getRoom("roomGround").current + getRoom("roomFirst").current) / 2),
      min: round((getRoom("roomGround").min + getRoom("roomFirst").min) / 2),
      max: round((getRoom("roomGround").max + getRoom("roomFirst").max) / 2),
    },
  };

  const humidityData = {
    groundFloor: getHumidity("humidityGround"),
    firstFloor: getHumidity("humidityFirst"),
    average: {
      current: round((getHumidity("humidityGround").current + getHumidity("humidityFirst").current) / 2),
      min: round((getHumidity("humidityGround").min + getHumidity("humidityFirst").min) / 2),
      max: round((getHumidity("humidityGround").max + getHumidity("humidityFirst").max) / 2),
    },
  };

  const heatPumpData = {
    left: getPump("leftPump"),
    right: getPump("rightPump"),
  };

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

        <div className="flex flex-col items-center justify-center pt-16 mt-10">
          <div className="flex space-x-12 mt-6">
            <div className="w-[400px] bg-gray-900 p-6 rounded-lg border border-yellow-500">
              <h2 className="text-lg font-bold text-center mb-4">Ruimte Informatie</h2>
              <div>Begane Grond: <b className="text-yellow-400">{roomData.groundFloor.current}°C</b></div>
              <div>Min: {roomData.groundFloor.min}°C - Max: {roomData.groundFloor.max}°C</div>
              <div className="mt-4">Verdieping 1: <b className="text-yellow-400">{roomData.firstFloor.current}°C</b></div>
              <div>Min: {roomData.firstFloor.min}°C - Max: {roomData.firstFloor.max}°C</div>
              <div className="mt-6 border-t border-gray-700 pt-4 text-center">
                <h3 className="text-md font-bold">Gemiddelde</h3>
                <div className="text-lg text-yellow-400"><b>{roomData.average.current}°C</b></div>
                <div className="text-sm">Min: {roomData.average.min}°C - Max: {roomData.average.max}°C</div>
              </div>
            </div>

            <div className="w-[400px] bg-gray-900 p-6 rounded-lg border border-yellow-500">
              <h2 className="text-lg font-bold text-center mb-6">Warmtepompen</h2>
              <div className="grid grid-cols-2 gap-4">
                {(["left", "right"] as const).map(side => (
                  <div key={side} className="bg-black p-4 rounded-lg border border-yellow-500">
                    <h3 className="text-md font-bold text-center text-yellow-400">{side === "left" ? "Links" : "Rechts"}</h3>
                    <div className="text-center text-3xl font-bold">{heatPumpData[side].current}°C</div>
                    <div className="text-sm text-center">Min: {heatPumpData[side].min}°C</div>
                    <div className="text-sm text-center">Gem: {heatPumpData[side].avg}°C</div>
                    <div className="text-sm text-center">Max: {heatPumpData[side].max}°C</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[400px] bg-gray-900 p-6 rounded-lg border border-yellow-500">
              <h2 className="text-lg font-bold text-center mb-4">Ruimte Informatie 2</h2>
              <div>Begane Grond: <b className="text-yellow-400">{humidityData.groundFloor.current}%</b></div>
              <div>Min: {humidityData.groundFloor.min}% - Max: {humidityData.groundFloor.max}%</div>
              <div className="mt-4">Verdieping 1: <b className="text-yellow-400">{humidityData.firstFloor.current}%</b></div>
              <div>Min: {humidityData.firstFloor.min}% - Max: {humidityData.firstFloor.max}%</div>
              <div className="mt-6 border-t border-gray-700 pt-4 text-center">
                <h3 className="text-md font-bold">Gemiddelde</h3>
                <div className="text-lg text-yellow-400"><b>{humidityData.average.current}%</b></div>
                <div className="text-sm">Min: {humidityData.average.min}% - Max: {humidityData.average.max}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeatPumps;
