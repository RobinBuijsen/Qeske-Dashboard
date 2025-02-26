import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

console.log("Management.tsx geladen");

// Definieer een interface voor gebruikers
interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  isApproved: boolean;
}

// Definieer een interface voor alerts
interface Alert {
  id: number;
  type: string;
  thresholdType: string;
  threshold: number;
  message: string;
  userId: number;
  entity_id: number;
  time_start: string;
  time_end: string;
}

export default function Management() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modal, setModal] = useState<{ type: string; itemId: number | null; user?: User; alert?: Alert }>({ type: "", itemId: null });
  const [editUser, setEditUser] = useState<User | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, []);

  //  Data ophalen voor zowel gebruikers als alerts
  const fetchData = async () => {
    setLoading(true);
    await fetchUsers();
    await fetchAlerts();
    setLoading(false);
  };

  // Gebruikers ophalen
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Fout bij ophalen gebruikers: ${response.status}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fout bij ophalen gebruikers:", error);
    }
  };

  //  Alerts ophalen
  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/alerts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Fout bij ophalen alerts: ${response.status}`);
      }

      const data = await response.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fout bij ophalen alerts:", error);
    }
  };

  // Functies voor gebruikersbeheer
  const approveUser = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/users/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => (user.id === id ? { ...user, isApproved: true } : user)));
    } catch (error) {
      console.error("Fout bij goedkeuren:", error);
    }
    setModal({ type: "", itemId: null });
  };

  const rejectUser = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Fout bij afwijzen:", error);
    }
    setModal({ type: "", itemId: null });
  };

  const deleteUser = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Fout bij verwijderen gebruiker:", error);
    }
    setModal({ type: "", itemId: null });
  };

  const deleteAlert = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/alerts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(alerts.filter(alert => alert.id !== id));
    } catch (error) {
      console.error("Fout bij verwijderen alert:", error);
    }
    setModal({ type: "", itemId: null });
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setModal({ type: "editUser", itemId: user.id, user });
  };

  const handleSaveUser = async () => {
    if (!editUser) return;

    try {
      const response = await fetch(`http://localhost:3000/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUser),
      });

      if (!response.ok) {
        throw new Error(`Fout bij updaten gebruiker: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      setEditUser(null);
      setModal({ type: "", itemId: null });
    } catch (error) {
      console.error("Fout bij updaten gebruiker:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0E1E3D] text-black">
        <h1 className="text-2xl text-yellow-500">Laden...</h1>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center bg-[#0E1E3D] p-10 overflow-y-auto w-screen min-h-screen text-black">
        <h1 className="text-4xl font-bold text-yellow-500 mb-6">Beheerpagina</h1>

        {/* Account Verzoeken */}
        <div className="bg-[#FFEC56] p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
          <h2 className="text-xl font-bold mb-4">Account Verzoeken</h2>
          {users.filter(user => !user.isApproved).map(user => (
            <div key={user.id} className="flex justify-between items-center p-2">
              <p className="text-black">{user.first_name} {user.last_name} - {user.username} - {user.email}</p>
              <div className="flex gap-2">
                <button className="bg-green-500 px-4 py-1 rounded text-white hover:bg-green-700" onClick={() => setModal({ type: "approve", itemId: user.id, user })}>
                  Goedkeuren
                </button>
                <button className="bg-red-500 px-4 py-1 rounded text-white hover:bg-red-700" onClick={() => setModal({ type: "reject", itemId: user.id, user })}>
                  Afkeuren
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Gebruikersbeheer */}
        <div className="bg-[#FFEC56] p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
          <h2 className="text-xl font-bold mb-4">Gebruikersbeheer</h2>
          {users.map(user => (
            <div key={user.id} className="flex justify-between items-center p-2 text-black">
              <p className="text-black">{user.first_name} {user.last_name} - {user.username} - {user.email}</p>
              <div className="flex gap-2">
                <button className="bg-blue-500 px-4 py-1 rounded text-white hover:bg-blue-700" onClick={() => handleEditUser(user)}>Bewerken</button>
                <button className="bg-red-500 px-4 py-1 rounded text-white hover:bg-red-700" onClick={() => setModal({ type: "deleteUser", itemId: user.id, user })}>
                  Verwijderen
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Beheer Alerts */}
        <div className="bg-[#FFEC56] p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Alerts</h2>
          {alerts.map(alert => (
            <div key={alert.id} className="flex justify-between items-center p-2 text-black">
              <p className="text-black">{alert.message}</p>
              <div className="flex gap-2">
                <button className="bg-blue-500 px-4 py-1 rounded text-white hover:bg-blue-700">Bewerken</button>
                <button className="bg-red-500 px-4 py-1 rounded text-white hover:bg-red-700" onClick={() => setModal({ type: "deleteAlert", itemId: alert.id, alert })}>
                  Verwijderen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmatie Modal */}
      {modal.type && (modal.user || modal.alert) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-yellow-400 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl text-black font-bold mb-4">
              {modal.type === "deleteUser" && `Weet je zeker dat je ${modal.user?.first_name} ${modal.user?.last_name} wilt verwijderen?`}
              {modal.type === "approve" && `Weet je zeker dat je ${modal.user?.first_name} ${modal.user?.last_name} wilt goedkeuren?`}
              {modal.type === "reject" && `Weet je zeker dat je ${modal.user?.first_name} ${modal.user?.last_name} wilt afwijzen?`}
              {modal.type === "deleteAlert" && `Weet je zeker dat je de alert: "${modal.alert?.message}" wilt verwijderen?`}
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-[#0E1E3D] text-yellow-400 px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => {
                  if (modal.type === "deleteUser") deleteUser(modal.itemId!);
                  if (modal.type === "approve") approveUser(modal.itemId!);
                  if (modal.type === "reject") rejectUser(modal.itemId!);
                  if (modal.type === "deleteAlert") deleteAlert(modal.itemId!);
                }}
              >
                Ja
              </button>
              <button
                className="bg-[#0E1E3D] text-yellow-400 px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => setModal({ type: "", itemId: null })}
              >
                Nee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bewerken Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-yellow-400 p-10 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-xl text-black font-bold mb-4">Gebruiker Bewerken</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                className="p-2 border border-gray-800 rounded-md"
                placeholder="Voornaam"
                value={editUser.first_name}
                onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
              />
              <input
                type="text"
                className="p-2 border border-gray-800 rounded-md"
                placeholder="Achternaam"
                value={editUser.last_name}
                onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
              />
              <input
                type="text"
                className="p-2 border border-gray-800 rounded-md"
                placeholder="Gebruikersnaam"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
              />
              <input
                type="email"
                className="p-2 border border-gray-800 rounded-md"
                placeholder="E-mail"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
              <input
                type="password"
                className="p-2 border border-gray-800 rounded-md"
                placeholder="Wachtwoord (leeg laten om niet te wijzigen)"
                value={editUser.password || ""}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
              />
              <input
                type="text"
                className="p-2 border border-gray-800 rounded-md"
                placeholder="Rol"
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              />
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="bg-green-500 px-4 py-2 rounded-md text-white"
                onClick={handleSaveUser}
              >
                Opslaan
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded-md text-white"
                onClick={() => setEditUser(null)}
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
