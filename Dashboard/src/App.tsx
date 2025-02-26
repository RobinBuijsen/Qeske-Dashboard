import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EnergyFlowDiagrams from "./pages/EnergyFlowDiagrams";
import HeatPumps from "./pages/HeatPumps";
import Buildings from "./pages/Buildings";
import Consumers from "./pages/Consumers";
import Reports from "./pages/Reports"; 
import Management from "./pages/Management";

function App() {
  return (
    <Router>
      <Routes>
        {/* Standaard = loginpagina */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Loginpagina */}
        <Route path="/login" element={<Login />} />

        {/* Pagina voor account aanmaken */}
        <Route path="/register" element={<Register />} />

        {/* Pagina voor wachtwoord vergeten */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Home Pagina */}
        <Route path="/home" element={<Home />} />

        {/* EnergieFlow diagrammen Pagina */}
        <Route path="/energyflow" element={<EnergyFlowDiagrams />} />

        {/* Warmtepompen Pagina */}
        <Route path="/HeatPumps" element={<HeatPumps />} />

        {/* Gebouwen Pagina */}
        <Route path="/Buildings" element={<Buildings />} />

        {/* Zie verbruikers pagina */}
        <Route path="/consumers" element={<Consumers />} />

        {/* Zie rapporten pagina */}
        <Route path="/reports" element={<Reports />} /> 

        {/* Zie beheer pagina */}
        <Route path="/management" element={<Management />} /> 
      </Routes>
    </Router>
  );
}

export default App;

