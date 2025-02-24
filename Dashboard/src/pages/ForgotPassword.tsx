import { useNavigate } from "react-router-dom";
export default function ForgotPassword() {
  const navigate = useNavigate();
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0E1E3D]">
        <div className="text-center">
          <h1 className="text-[#FFEC56] text-4xl font-bold mb-6">Wachtwoord Vergeten</h1>
          <div className="bg-[#FFEC56] p-10 sm:p-16 rounded-lg shadow-lg w-full max-w-lg">
            <form>
              <input
                type="email"
                placeholder="E-mail"
                className="w-full mb-4 p-2 rounded-lg border border-[#0E1E3D] text-[black] focus:outline-none focus:ring focus:ring-[#0E1E3D]"
              />
              <button
                type="submit"
                className="w-full bg-[#0E1E3D] text-[#FFEC56] p-2 rounded-lg hover:bg-[#0C172F] transition"
              >
                Verstuur Reset Link
              </button>

            {/* "Terug"-knop */}
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-[#0E1E3D] text-[#FFEC56] py-2 px-4 rounded-lg hover:bg-[#0C172F] transition"
            >
              Terug
            </button>

            </form>
          </div>
        </div>
      </div>
    );
  }
  