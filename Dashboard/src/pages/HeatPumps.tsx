import React from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

const HeatPumps: React.FC = () => {
  // Dummy data
  const roomData = {
    groundFloor: { min: 21.3, avg: 21.9, max: 22.4, current: 22.4 },
    firstFloor: { min: 21.5, avg: 21.9, max: 22.4, current: 21.8 },
    average: { min: 21.3, avg: 21.7, max: 22.4, current: 22.1 },
  };

  const heatPumpData = {
    left: { min: 25, avg: 36, max: 44, current: 38 },
    right: { min: 26, avg: 36.2, max: 44, current: 40 },
  };

  const humidityData = {
    groundFloor: { min: 22.5, avg: 23.8, max: 25.4, current: 23.7 },
    firstFloor: { min: 24.6, avg: 25.1, max: 26.5, current: 26.5 },
    average: { min: 22.5, avg: 24.7, max: 26.5, current: 25.1 },
  };

  return (
    <>
      <NavBar />
      <div className="bg-[#0E1E3D] min-h-screen text-white relative">
        {/* Back button */}
        <div className="absolute top-10 left-1">
          <Link to="/energyflow">
            <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold hover:bg-yellow-600 text-sm">
              ← Terug
            </button>
          </Link>
        </div>

        {/* Heat Pump Information */}
        <div className="flex flex-col items-center justify-center pt-16 mt-10">
          <div className="flex space-x-12 mt-6">
            {/* Room Information */}
            <div className="w-[400px] bg-gray-900 p-6 rounded-lg border border-yellow-500 flex flex-col justify-center">
              <h2 className="text-lg font-bold text-center mb-4 flex items-center justify-center h-10">Ruimte Informatie</h2>
              <div className="mb-2">Begane Grond: <b className="text-yellow-400">{roomData.groundFloor.current}°C</b></div>
              <div className="mb-2">Min: {roomData.groundFloor.min}°C - Max: {roomData.groundFloor.max}°C</div>
              <div className="mt-4">Verdieping 1: <b className="text-yellow-400">{roomData.firstFloor.current}°C</b></div>
              <div className="mb-2">Min: {roomData.firstFloor.min}°C - Max: {roomData.firstFloor.max}°C</div>

              {/* Average */}
              <div className="mt-6 border-t border-gray-700 pt-4">
                <h3 className="text-md font-bold text-center">Gemiddelde</h3>
                <div className="text-center text-lg text-yellow-400"><b>{roomData.average.current}°C</b></div>
                <div className="text-sm text-center">Min: {roomData.average.min}°C - Max: {roomData.average.max}°C</div>
              </div>
            </div>

        {/* Warmtepompen */}
            <div className="w-[400px] bg-gray-900 p-6 rounded-lg border border-yellow-500 flex flex-col justify-start">
            <h2 className="text-lg font-bold text-center mb-6">Warmtepompen</h2>

    	{/* Container voor beide warmtepompen */}
            <div className="grid grid-cols-2 gap-4">

        {/* Links */}
            <div className="bg-black p-4 rounded-lg border border-yellow-500">
            <h3 className="text-md font-bold text-center text-yellow-400">Links</h3>
            <div className="text-center text-3xl font-bold">{heatPumpData.left.current}°C</div>
            <div className="text-sm text-center">Min: {heatPumpData.left.min}°C</div>
            <div className="text-sm text-center">Gem: {heatPumpData.left.avg}°C</div>
            <div className="text-sm text-center">Max: {heatPumpData.left.max}°C</div>
          </div>

        {/* Rechts */}
            <div className="bg-black p-4 rounded-lg border border-yellow-500">
                <h3 className="text-md font-bold text-center text-yellow-400">Rechts</h3>
                <div className="text-center text-3xl font-bold">{heatPumpData.right.current}°C</div>
                <div className="text-sm text-center">Min: {heatPumpData.right.min}°C</div>
                <div className="text-sm text-center">Gem: {heatPumpData.right.avg}°C</div>
                <div className="text-sm text-center">Max: {heatPumpData.right.max}°C</div>
            </div>
            </div>
        </div>

            {/* Humidity Information */}
            <div className="w-[400px] bg-gray-900 p-6 rounded-lg border border-yellow-500 flex flex-col justify-center">
              <h2 className="text-lg font-bold text-center mb-4 flex items-center justify-center h-10">Ruimte Informatie 2</h2>
              <div className="mb-2">Begane Grond: <b className="text-yellow-400">{humidityData.groundFloor.current}%</b></div>
              <div className="mb-2">Min: {humidityData.groundFloor.min}% - Max: {humidityData.groundFloor.max}%</div>
              <div className="mt-4">Verdieping 1: <b className="text-yellow-400">{humidityData.firstFloor.current}%</b></div>
              <div className="mb-2">Min: {humidityData.firstFloor.min}% - Max: {humidityData.firstFloor.max}%</div>

              {/* Average */}
              <div className="mt-6 border-t border-gray-700 pt-4">
                <h3 className="text-md font-bold text-center">Gemiddelde</h3>
                <div className="text-center text-lg text-yellow-400"><b>{humidityData.average.current}%</b></div>
                <div className="text-sm text-center">Min: {humidityData.average.min}% - Max: {humidityData.average.max}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeatPumps;
