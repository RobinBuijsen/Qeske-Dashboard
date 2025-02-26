import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, LoginData } from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await loginUser(formData);

    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", JSON.stringify(response.user.role));
      navigate("/home"); // Stuur gebruiker door naar de homepagina
    } else {
      setErrorMessage(response.message || "Inloggen mislukt.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0E1E3D]">
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
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
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
              name="username"
              placeholder="Gebruikersnaam"
              value={formData.username}
              onChange={handleChange}
              className="w-full mb-4 p-2 rounded-lg border border-[#0E1E3D] text-[black] focus:outline-none focus:ring focus:ring-[#0E1E3D]"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Wachtwoord"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-6 p-2 rounded-lg border border-[#0E1E3D] text-[black] focus:outline-none focus:ring focus:ring-[#0E1E3D]"
              required
            />

            {/* Error Message */}
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            {/* Login Button */}
            <button
              type="submit"
              className="bg-[#0E1E3D] text-[#FFEC56] py-2 px-4 rounded-lg hover:bg-[#0C172F] transition w-full"
            >
              Log in
            </button>
          </form>

          {/* Links */}
          <div className="text-sm text-[#3474FF] space-y-2 mt-5">
            <a href="/register" className="block hover:underline">
              Account aanmaken
            </a>
            <a href="/forgot-password" className="block hover:underline">
              Wachtwoord vergeten
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
