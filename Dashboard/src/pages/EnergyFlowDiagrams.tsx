import React from "react";
import NavBar from "../components/NavBar";
import EnergyFlow from "../components/EnergyFlow";
import EnergyFlowNu from "../components/EnergyFlowNu";
import PVPanelChart from "../components/PVPanelChart"; 
import { Link } from "react-router-dom";

const EnergyFlowDiagrams: React.FC = () => {
  return (
    <div className="bg-[#0E1E3D] min-h-screen text-white overflow-y-auto overflow-x-hidden w-screen">
      <NavBar />
      <div className="bg-[#0E1E3D] text-white min-h-screen pt-[40px] overflow-y-auto w-screen">
        <div className="flex flex-col items-center pt-[60px]"> 
          {/* Buttons */}
          <div className="w-full flex justify-start pl-10 relative top-[-50px] space-x-2">
            <Link to="/HeatPumps">
            <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold hover:bg-yellow-600 text-sm">
              Warmtepompen
              </button>
            </Link>
            <Link to="/Buildings">
            <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold hover:bg-yellow-600 text-sm">
              Verbruik gebouwen
              </button>
            </Link>
          </div>

          {/* EnergieFlow Diagrammen */}
          <div className="flex space-x-2">
            <div className="relative w-[700px] h-[450px] border border-yellow-500 rounded-lg flex flex-col justify-center items-center">
              <h2 className="absolute -top-8 left-1 text-lg font-bold mb-2">Energieflow Vandaag</h2>
              <EnergyFlow />
            </div>
            <div className="relative w-[700px] h-[450px] border border-yellow-500 rounded-lg flex flex-col justify-center items-center">
              <h2 className="absolute -top-8 left-1 text-lg font-bold mb-2">Energieflow Nu</h2>
              <EnergyFlowNu />
            </div>
          </div>

          {/* PV Panelen Chart */}
          <div className="mt-8 w-[1420px] border border-yellow-500 rounded-lg p-4 mb-8">
            <PVPanelChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowDiagrams;
