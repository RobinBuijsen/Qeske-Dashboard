const API_BASE_URL = "http://localhost:3000/api";

export interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

// Gebruiker registreren
export const registerUser = async (userData: UserData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    return response.json();
  } catch (error) {
    console.error("Registratiefout:", error);
    return { message: "Er is een fout opgetreden bij het registreren." };
  }
};

// Gebruiker inloggen
export interface LoginData {
  username: string;
  password: string;
}

export const loginUser = async (loginData: LoginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    return response.json();
  } catch (error) {
    console.error("Login fout:", error);
    return { message: "Er is een fout opgetreden bij het inloggen." };
  }
};

