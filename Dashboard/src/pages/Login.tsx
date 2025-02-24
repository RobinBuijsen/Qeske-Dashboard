import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Tijdelijke inloggegevens
  const validUsername = "U1";
  const validPassword = "123";

  // Inloggen
  const handleLogin = () => {
    if (username === validUsername && password === validPassword) {
      navigate("/home"); // Navigeren naar de homepagina
    } else {
      setErrorMessage("Username or password incorrect");
    }
  };

  // Functie om Enter-toets te detecteren
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Voorkom standaard herladen van de pagina
      handleLogin();
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-[#0E1E3D]"
      onKeyDown={handleKeyDown} // Detecteert Enter-toets
    >
      <div className="text-center">
        {/* Logo */}
        <img
          src="/src/assets/LogoQeske.png"
          alt="Qeske Logo"
          className="mx-auto mt-0,5 mb-3 w-32 h-32"
        />

        {/* Titel */}
        <h1 className="text-[#FFEC56] text-4xl font-bold mb-3">Qeske</h1>

        {/* Login Card */}
        <div className="bg-[#FFEC56] p-10 sm:p-16 rounded-lg shadow-lg w-full max-w-lg mb-14">
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div className="bg-[#0E1E3D] text-[#FFEC56] rounded-full p-6 mt-0,1 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12c2.28 0 4.14-1.86 4.14-4.14S14.28 3.72 12 3.72 7.86 5.58 7.86 7.86 9.72 12 12 12zM4.5 19.5c0-2.2 1.79-4 4-4h7c2.2 0 4 1.8 4 4v.5H4.5V19.5z"
                />
              </svg>
            </div>

            {/* Input Fields */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-4 p-2 rounded-lg border border-[#0E1E3D] text-[black] focus:outline-none focus:ring focus:ring-[#0E1E3D]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-6 p-2 rounded-lg border border-[#0E1E3D] text-[black] focus:outline-none focus:ring focus:ring-[#0E1E3D]"
            />

            {/* Error Message */}
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="bg-[#0E1E3D] text-[#FFEC56] py-2 px-4 rounded-lg hover:bg-[#0C172F] transition w-full"
            >
              Log in
            </button>

            {/* Links */}
            <div className="text-sm text-[#3474FF] space-y-2 mt-5">
              <a href="/register" className="block hover:underline">
                account aanmaken
              </a>
              <a href="/forgot-password" className="block hover:underline">
                wachtwoord vergeten
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
