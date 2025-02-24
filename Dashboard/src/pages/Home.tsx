import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import Meters from "../components/Meters";
import NavBar from "../components/NavBar";

export default function Home() {
  console.log("Rendering Home component");

  return (
    <>
      {/* NavBar */}
      <NavBar />

      {/* Overige inhoud */}
      <div className="bg-[#0E1E3D] text-white min-h-screen pt-[70px] overflow-y-auto w-screen">
        {/* Grid layout voor de grafieken */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-none auto-rows-[500px]">
          {/* Eerste rij: Verbruik en Cirkelgrafiek */}
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              <BarChart title="Totaal energie verbruik nu" />
            </div>
          </div>
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              <PieChart />
            </div>
          </div>

          {/* Tweede rij: Productie en Meters */}
          <div className="border border-yellow-500 p-4 rounded-lg h-[450px]">
            <div className="w-full h-full flex justify-center items-center">
              <BarChart title="Totaal energie productie nu" />
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
