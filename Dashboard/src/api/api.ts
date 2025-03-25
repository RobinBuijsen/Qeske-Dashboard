const API_BASE_URL = "http://localhost:3000/api";

export interface Entity {
  id: number;
  entity_id: string;
  name: string;
  description: string;
}

export interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

// Interface voor alerts
export interface AlertData {
  thresholdType: string;
  threshold: number;
  thresholdUnit: "kw" | "kwh";
  message: string;
  userId: number;
  entity_id: number;
  time_start: string;
  time_end: string;
  duration: number;
}

interface Alert {
  id: number;
  thresholdType: string;
  threshold: number;
  thresholdUnit: "kw" | "kwh";
  message: string;
  userId: number;
  entity_id: number;
  time_start: string;
  time_end: string;
  duration: number;
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

// Gebruikers ophalen
export const fetchUsers = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  } catch (error) {
    console.error("Fout bij ophalen gebruikers:", error);
    return { message: "Er is een fout opgetreden bij het ophalen van gebruikers." };
  }
};

// Gebruiker goedkeuren
export const approveUser = async (id: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  } catch (error) {
    console.error("Fout bij goedkeuren gebruiker:", error);
    return { message: "Er is een fout opgetreden bij het goedkeuren van de gebruiker." };
  }
};

// Gebruiker afwijzen/verwijderen
export const rejectUser = async (id: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  } catch (error) {
    console.error("Fout bij afwijzen/verwijderen gebruiker:", error);
    return { message: "Er is een fout opgetreden bij het afwijzen/verwijderen van de gebruiker." };
  }
};

// Gebruiker updaten
export const updateUser = async (id: number, userData: Partial<UserData>, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  } catch (error) {
    console.error("Fout bij updaten gebruiker:", error);
    return { message: "Er is een fout opgetreden bij het updaten van de gebruiker." };
  }
};

// Gebruiker ophalen op basis van ID
export const getUserById = async (id: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Fout bij ophalen gebruiker: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fout bij ophalen gebruiker:", error);
    return null;
  }
};

// Alerts ophalen
export const fetchAlerts = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Fout bij ophalen alerts: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fout bij ophalen alerts:", error);
    return [];
  }
};

// Nieuwe alert aanmaken
export const createAlert = async (alertData: AlertData, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(alertData),
    });

    if (!response.ok) {
      throw new Error(`Fout bij aanmaken alert: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fout bij aanmaken alert:", error);
    return null;
  }
};

// Alert aanpassen
export const updateAlert = async (id: number, alertData: Partial<Alert>, token: string) => {
  try {
    console.log("📨 Data die naar de API wordt gestuurd:", JSON.stringify(alertData, null, 2));

    const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(alertData),
    });

    const responseText = await response.text(); // Haal de volledige error-inhoud op

    if (!response.ok) {
      throw new Error(`❌ Fout bij updaten alert: ${response.status} - ${responseText}`);
    }

    console.log("✅ Alert succesvol geüpdatet:", responseText);
    return JSON.parse(responseText); // Parse de JSON alleen als het een geldige response is
  } catch (error) {
    console.error("❌ API Fout:", error);
    return null;
  }
};




// Alert verwijderen
export const deleteAlert = async (id: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Fout bij verwijderen alert: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Fout bij verwijderen alert:", error);
    return false;
  }
};

// Entiteiten ophalen
export const fetchEntities = async (token: string) => {
  try {
      console.log("➡️ fetchEntities wordt aangeroepen!");
      
      const response = await fetch(`${API_BASE_URL}/entities`, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      });

      console.log("📡 API Response ontvangen:", response);

      if (!response.ok) {
          throw new Error(`⚠️ Fout bij ophalen entiteiten: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Data van API:", data);

      return data;
  } catch (error) {
      console.error("❌ Fout bij ophalen entiteiten:", error);
      return [];
  }
};


// Entiteit aanmaken
export const createEntity = async (entityData: Partial<Entity>, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/entities`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(entityData),
    });
    return response.json();
  } catch (error) {
    console.error("Fout bij aanmaken entiteit:", error);
    return null;
  }
};

// Entiteit updaten
export const updateEntity = async (id: number, entityData: Partial<Entity>, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/entities/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(entityData),
    });

    if (!response.ok) {
      throw new Error(`Fout bij updaten entiteit: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fout bij updaten entiteit:", error);
    return null;
  }
};

// Entiteit verwijderen
export const deleteEntity = async (id: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/entities/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Fout bij verwijderen entiteit: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Fout bij verwijderen entiteit:", error);
    return false;
  }
};

// Entiteit ophalen op basis van ID
export const fetchEntityMeasurements = async (entity_id: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/entities/data/${entity_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Fout bij ophalen meetgegevens: ${response.status}`);
    }

    const data = await response.json();
    console.log("📊 Influx data ontvangen:", data);
    return data;
  } catch (error) {
    console.error("❌ Fout bij ophalen meetgegevens uit Influx:", error);
    return null;
  }
};





