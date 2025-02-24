import React from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

const ConsumptionBuildings: React.FC = () => {
  // Dummy data voor gebouwen en hun energieverbruik
  const buildings = [
    {
      name: "Wiebachstraat 36",
      currentUsage: 4861,
      min: 551,
      max: 6982,
      phases: [557, 1145, 3159],
    },
    {
      name: "Wiebachstraat 38",
      currentUsage: 5535,
      min: 2824,
      max: 16395,
      phases: [3409, 417, 1708],
    },
    {
      name: "Locht 42",
      currentUsage: 4022,
      min: 147,
      max: 9331,
      phases: [241, 3084, 697],
    },
    {
      name: "Locht 44",
      currentUsage: 17888,
      min: 4419,
      max: 28143,
      phases: [5739, 3284, 6280],
    },
  ];

  return (
    <>
      <NavBar />
      <div className="bg-[#0E1E3D] min-h-screen text-white relative">
        {/* Terug-knop linksboven */}
        <div className="absolute top-10 left-1">
          <Link to="/energyflow">
            <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold hover:bg-yellow-600 text-sm">
              ← Terug
            </button>
          </Link>
        </div>

        {/* Gebouwen informatie */}
        <div className="flex flex-col items-center pt-16 mt-10">
          <div className="flex space-x-6">
            {buildings.map((building, index) => (
              <div
                key={index}
                className="w-[300px] bg-gray-900 p-6 rounded-lg border border-yellow-500 flex flex-col justify-center"
              >
                <h2 className="text-lg font-bold text-center mb-4">{building.name}</h2>
                <div className="text-center text-2xl font-bold text-yellow-400">
                  {building.currentUsage.toLocaleString()} W
                </div>
                <div className="text-sm text-center mt-2">
                  Min: {building.min.toLocaleString()} W - Max: {building.max.toLocaleString()} W
                </div>

                {/* Fases */}
                <div className="flex justify-between mt-4 text-center">
                  <div className="w-1/3">
                    <h3 className="text-sm font-bold text-blue-400">Fase 1</h3>
                    <div className="text-lg">{building.phases[0]} W</div>
                  </div>
                  <div className="w-1/3">
                    <h3 className="text-sm font-bold text-blue-400">Fase 2</h3>
                    <div className="text-lg">{building.phases[1]} W</div>
                  </div>
                  <div className="w-1/3">
                    <h3 className="text-sm font-bold text-blue-400">Fase 3</h3>
                    <div className="text-lg">{building.phases[2]} W</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsumptionBuildings;
