import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getUserById, updateUser } from "../api/api";

console.log("Management.tsx geladen");

// Definieer een interface voor gebruikers
interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password?: string;
  roleId: number;
  isApproved: boolean;
}

// Definieer een interface voor alerts
interface Alert {
  id: number;
  thresholdType: string;
  threshold: number;
  thresholdUnit: "kw" | "kwh";  // Nieuw toegevoegd
  message: string;
  userId: number;
  entity_id: number;
  time_start: string;
  time_end: string;
  duration: number; // Nieuw toegevoegd
}

export default function Management() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modal, setModal] = useState<{ type: string; itemId: number | null; user?: User; alert?: Alert }>({ type: "", itemId: null });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [password, setPassword] = useState<string>("");
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await fetchUsers();
    await fetchAlerts();
    setLoading(false);
  };

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

  const handleEditUser = async (userId: number) => {
    try {
      const userData = await getUserById(userId, token!);
      if (userData) {
        setEditUser(userData); 
        setModal({ type: "editUser", itemId: userId });
      }
    } catch (error) {
      console.error("Fout bij ophalen van gebruiker:", error);
    }
  };

  const handleSaveUser = async () => {
    if (!editUser) return;

    const userDataToSend = { ...editUser };
    if (password) {
      userDataToSend.password = password;
    } else {
      delete userDataToSend.password;
    }

    try {
      const updatedUser = await updateUser(editUser.id, userDataToSend, token!);
      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      setEditUser(null);
      setPassword("");
      setModal({ type: "", itemId: null });
    } catch (error) {
      console.error("Fout bij updaten gebruiker:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editUser) {
      const { name, value } = e.target;
      if (name === "password") {
        setPassword(value);
      } else if (name === "role") {
        setEditUser({ ...editUser, roleId: value === "admin" ? 2 : 1 });
      } else {
        setEditUser({ ...editUser, [name]: value });
      }
    }
  };

  const handleAlertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAlert({ ...newAlert, [name]: value });
  };

  const handleSaveAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAlert),
      });

      if (!response.ok) {
        throw new Error(`Fout bij aanmaken alert: ${response.status}`);
      }

      const createdAlert = await response.json();
      setAlerts([...alerts, createdAlert]);
      setNewAlert({});
      setModal({ type: "", itemId: null });
    } catch (error) {
      console.error("Fout bij aanmaken alert:", error);
    }
  };

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
                <button className="bg-blue-500 px-4 py-1 rounded text-white hover:bg-blue-700" onClick={() => handleEditUser(user.id)}>Bewerken</button>
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
          <button className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-700 mb-4" onClick={() => setModal({ type: "createAlert", itemId: null })}>
            Alert Aanmaken
          </button>
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
          <div className="bg-yellow-400 p-10 rounded-lg shadow-lg text-center w-full max-w-lg">
            <h2 className="text-xl text-black font-bold mb-4">Gebruiker Bewerken</h2>
            <form onSubmit={handleSaveUser}>
              <input
                type="text"
                name="first_name"
                placeholder="Voornaam"
                value={editUser.first_name}
                onChange={handleChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Achternaam"
                value={editUser.last_name}
                onChange={handleChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Gebruikersnaam"
                value={editUser.username}
                onChange={handleChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={editUser.email}
                onChange={handleChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Voer hier het nieuwe wachtwoord in (optioneel)"
                value={password}
                onChange={handleChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                autoComplete="new-password"
              />
              <select
                name="role"
                value={editUser.roleId === 2 ? "admin" : "user"}
                onChange={handleChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                required
              >
                {editUser.roleId === 2 ? (
                  <>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </>
                ) : (
                  <>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </>
                )}
              </select>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  type="submit"
                  className="bg-green-500 px-4 py-2 rounded-md text-white"
                >
                  Opslaan
                </button>
                <button
                  type="button"
                  className="bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={() => setEditUser(null)}
                >
                  Annuleren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Aanmaken Modal */}
      {modal.type === "createAlert" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-yellow-400 p-10 rounded-lg shadow-lg text-center w-full max-w-lg">
            <h2 className="text-xl text-black font-bold mb-4">Alert Aanmaken</h2>
            <form onSubmit={handleSaveAlert}>
              
              {/* Dropdown voor Threshold Type */}
              <select
                name="thresholdType"
                value={newAlert.thresholdType || ""}
                onChange={handleAlertChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                required
              >
                <option value="" disabled>Threshold Type</option>
                <option value="minimum">Minimaal</option>
                <option value="maximum">Maximaal</option>
              </select>

              {/* Threshold invoerveld + dropdown voor eenheid */}
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="threshold"
                  placeholder="Threshold waarde"
                  value={newAlert.threshold || ""}
                  onChange={handleAlertChange}
                  className="w-3/4 mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                  required
                />
                <select
                  name="thresholdUnit"
                  value={newAlert.thresholdUnit || "kW"}
                  onChange={handleAlertChange}
                  className="w-1/4 mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                >
                  <option value="kW">kW</option>
                  <option value="kWh">kWh</option>
                </select>
              </div>

              {/* Message */}
              <input
                type="text"
                name="message"
                placeholder="Message"
                value={newAlert.message || ""}
                onChange={handleAlertChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                required
              />

              {/* Entity ID */}
              <input
                type="number"
                name="entity_id"
                placeholder="Entity Id"
                value={newAlert.entity_id || ""}
                onChange={handleAlertChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                required
              />

              {/* Tijd selectie voor Time Start & Time End */}
              <div className="flex space-x-2">
                <input
                  type="time"
                  name="time_start"
                  value={newAlert.time_start || ""}
                  onChange={handleAlertChange}
                  className="w-1/2 mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                  required
                />
                <input
                  type="time"
                  name="time_end"
                  value={newAlert.time_end || ""}
                  onChange={handleAlertChange}
                  className="w-1/2 mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                  required
                />
              </div>

              {/* Duration in seconden */}
              <input
                type="number"
                name="duration"
                placeholder="Duur (in seconden)"
                value={newAlert.duration || ""}
                onChange={handleAlertChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black focus:outline-none focus:ring focus:ring-[#0E1E3D]"
                required
              />

              <div className="flex justify-center space-x-4 mt-4">
                <button
                  type="submit"
                  className="bg-green-500 px-4 py-2 rounded-md text-white"
                >
                  Opslaan
                </button>
                <button
                  type="button"
                  className="bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={() => setModal({ type: "", itemId: null })}
                >
                  Annuleren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}