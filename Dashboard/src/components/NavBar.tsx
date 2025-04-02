import { BsLightbulb } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentWeather, setCurrentWeather] = useState<string>("-- | Onbekend weer");
  const [extraWeather, setExtraWeather] = useState<string>("Neerslag: --, Luchtvochtigheid: --%, Wind: -- km/h");
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const navigate = useNavigate();
  const storedRole = localStorage.getItem("role");
  const userRole = storedRole ? JSON.parse(storedRole).name : "user";

  const getWeatherIcon = (state: string): string => {
    const s = state.toLowerCase();
    if (s.includes("sun") || s.includes("clear")) return "☀️";
    if (s.includes("cloud") || s.includes("overcast")) return "☁️";
    if (s.includes("partly")) return "⛅";
    if (s.includes("rain")) return "🌧️";
    if (s.includes("snow")) return "❄️";
    if (s.includes("storm") || s.includes("thunder")) return "⛈️";
    return "🌡️"; // fallback
  };
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/weather/current", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Weerdata niet beschikbaar");

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Ongeldige response (geen JSON)");
        }

        const data = await response.json();

        const icon = getWeatherIcon(data.state);
        const weatherText = `${icon} ${data.temperature}°C | ${data.state}`;
        const extraText = `Neerslag: ${data.precipitation ?? "--"}mm, Luchtvochtigheid: ${data.humidity ?? "--"}%, Wind: ${data.wind_speed ?? "--"} km/h`;

        setCurrentWeather(weatherText);
        setExtraWeather(extraText);
      } catch (err) {
        console.error("Fout bij ophalen weerdata:", err);
      }
    };

    fetchWeather();

    const intervalId = setInterval(fetchWeather, 15 * 60 * 1000); 
    return () => clearInterval(intervalId);

  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      <nav className="flex justify-between items-center px-4 py-2 bg-[#0E1E3D] text-white w-full fixed top-0 z-10 h-[60px] border-b border-gray-700">
        <div className="flex items-center">
          <button onClick={() => navigate("/home")} className="flex items-center">
            <img
              src="/src/assets/LogoQeske.png"
              alt="Qeske Logo"
              className="h-8 w-8 mr-2"
            />
            <span className="text-lg font-bold">Qeske</span>
          </button>
        </div>

        <div className="flex space-x-2">
          {userRole === "admin" && (
            <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold hover:bg-yellow-600 text-sm"
              onClick={() => navigate("/management")}
            >
              Beheer
            </button>
          )}
          <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold hover:bg-yellow-600 text-sm"
            onClick={() => navigate("/reports")}
          >
            Rapporten
          </button>
          <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold hover:bg-yellow-600 text-sm"
            onClick={() => navigate("/consumers")}
          >
            Zie verbruikers
          </button>
          <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold hover:bg-yellow-600 text-sm"
            onClick={() => navigate("/energyflow")}
          >
            Energieflow Diagrammen
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span>{currentWeather}</span>
            <span>{extraWeather}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span>{currentTime}</span>
            <span>{currentDate}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="ml-1">
              <img
                src="/src/assets/BadgeGold.png"
                alt="Leaderboard"
                className="h-7 w-7 object-contain align-middle hover:big transform hover:-translate-y-1 hover:scale-110"
              />
            </button>
            <BsLightbulb className="h-5 w-5 object-contain align-middle cursor-pointer hover:text-yellow-400" />
            <FaUserCircle
              className="h-5 w-5 object-contain align-middle cursor-pointer hover:text-yellow-400"
              onClick={() => setShowProfile(!showProfile)}
            />
            <FiLogOut
              className="h-5 w-5 object-contain align-middle cursor-pointer hover:text-red-500"
              onClick={() => setShowLogoutModal(true)}
            />
          </div>
        </div>
      </nav>

      {showProfile && (
        <div className="absolute top-14 right-4 bg-yellow-400 p-4 rounded-lg shadow-lg text-black w-64 text-left">
          <div className="flex items-center mb-4">
            <FaUserCircle className="h-8 w-8 mr-2 text-gray-800" />
            <span className="text-lg text-black font-bold">Gebruikersprofiel</span>
          </div>
          <p className="text-black"><strong>Username:</strong> RobinB</p>
          <p className="text-black"><strong>Email:</strong> robinbuijsen@gmail.com</p>
          <p className="text-black"><strong>Naam:</strong> Robin Buijsen</p>
          <p className="text-black"><strong>Rol:</strong> Admin</p>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-yellow-400 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl text-black font-bold mb-4">Weet je zeker dat je wilt uitloggen?</h2>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-[#0E1E3D] text-yellow-400 px-4 py-2 rounded-md hover:bg-green-600"
                onClick={handleLogout}
              >
                Ja
              </button>
              <button
                className="bg-[#0E1E3D] text-yellow-400 px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => setShowLogoutModal(false)}
              >
                Nee
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
