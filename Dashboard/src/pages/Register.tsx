import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, UserData } from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await registerUser(formData);

    if (response.message) {
      alert(response.message);
      if (response.message.includes("succesvol")) {
        navigate("/"); // Stuur gebruiker terug naar login pagina na succesvolle registratie
      }
    } else {
      alert("Er is een fout opgetreden bij het registreren.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0E1E3D]">
      <div className="text-center">
        <h1 className="text-[#FFEC56] text-4xl font-bold mb-6">Account Aanmaken</h1>
        <div className="bg-[#FFEC56] p-10 sm:p-16 rounded-lg shadow-lg w-full max-w-lg">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="first_name"
              placeholder="Voornaam"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full mb-4 p-2 rounded-lg border border-[#0E1E3D] text-[black] focus:outline-none focus:ring focus:ring-[#0E1E3D]"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Achternaam"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full mb-4 p-2 rounded-lg border border-[#0E1E3D] text-[black] focus:outline-none focus:ring focus:ring-[#0E1E3D]"
              required
            />
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
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
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
              className="w-full mb-4 p-2 rounded-lg border border-[#0E1E3D] text-[black] focus:outline-none focus:ring focus:ring-[#0E1E3D]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#0E1E3D] text-[#FFEC56] p-2 rounded-lg hover:bg-[#0C172F] hover:text-[#FFEC56] transition"
            >
              Account Aanmaken
            </button>
          </form>

          {/* "Terug"-knop */}
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-[#0E1E3D] text-[#FFEC56] py-2 px-4 rounded-lg hover:bg-[#0C172F] transition"
          >
            Terug
          </button>
        </div>
      </div>
    </div>
  );
}
