import { useEffect, useState } from "react";
import { fetchEntities, createEntity, updateEntity, deleteEntity } from "../api/api";

interface Entity {
  id: number;
  entity_id: string;
  name: string;
  description: string;
}

export default function EntityManagement({ token }: { token: string }) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modal, setModal] = useState<{ type: string; entity?: Entity }>({ type: "" });
  const [newEntity, setNewEntity] = useState<Partial<Entity>>({});

  useEffect(() => {
    const fetchAllEntities = async () => {
      setLoading(true);
      try {
        const data = await fetchEntities(token);
        setEntities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fout bij ophalen entiteiten:", error);
        setEntities([]); // Fallback to an empty array
      }
      setLoading(false);
    };

    fetchAllEntities();
  }, [token]);

  const handleEntityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntity({ ...newEntity, [e.target.name]: e.target.value });
  };

  const handleSaveEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntity.entity_id || !newEntity.name) return;

    try {
      let savedEntity;
      if (newEntity.id) {
        savedEntity = await updateEntity(newEntity.id, newEntity, token);
      } else {
        savedEntity = await createEntity(newEntity, token);
      }

      if (savedEntity) {
        const updatedEntities = await fetchEntities(token);
        setEntities(Array.isArray(updatedEntities) ? updatedEntities : []);
        setNewEntity({});
        setModal({ type: "" });
      }
    } catch (error) {
      console.error("Fout bij opslaan entiteit:", error);
    }
  };

  const handleEditEntity = (entity: Entity) => {
    setNewEntity(entity); // Pre-fill the fields with the current entity data
    setModal({ type: "edit", entity });
  };

  const handleDeleteEntity = async () => {
    if (!modal.entity) return;
    try {
      const success = await deleteEntity(modal.entity.id, token);
      if (success) {
        const updatedEntities = await fetchEntities(token);
        setEntities(Array.isArray(updatedEntities) ? updatedEntities : []);
        setModal({ type: "" });
      }
    } catch (error) {
      console.error("Fout bij verwijderen entiteit:", error);
    }
  };

  return (
    <div className="bg-[#FFEC56] p-6 rounded-lg shadow-lg w-full max-w-4xl relative mt-8">
      <h2 className="text-xl font-bold mb-4">Entiteiten</h2>

      <button
        className="absolute top-4 right-4 bg-green-500 px-4 py-1 rounded text-white hover:bg-green-700"
        onClick={() => {
          setNewEntity({}); // Clear fields for creating a new entity
          setModal({ type: "create" });
        }}
      >
        Nieuwe entiteit toevoegen
      </button>

      {loading ? (
        <p className="text-black">Laden...</p>
      ) : entities.length > 0 ? (
        entities.map((entity) => (
          <div key={entity.id} className="flex justify-between items-center p-2">
            <p className="text-black">{entity.name} - {entity.entity_id}</p>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 px-4 py-1 rounded text-white hover:bg-blue-700"
                onClick={() => handleEditEntity(entity)}
              >
                Bewerken
              </button>
              <button
                className="bg-red-500 px-4 py-1 rounded text-white hover:bg-red-700"
                onClick={() => setModal({ type: "delete", entity })}
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-black">Geen entiteiten gevonden.</p>
      )}

      {/* Modal for creating/editing */}
      {modal.type === "create" || modal.type === "edit" ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-yellow-400 p-10 rounded-lg shadow-lg text-center w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {modal.type === "edit" ? "Bewerk Entiteit" : "Nieuwe Entiteit"}
            </h2>
            <form onSubmit={handleSaveEntity}>
              <input
                type="text"
                name="entity_id"
                placeholder="Entity ID"
                value={newEntity.entity_id || ""}
                onChange={handleEntityChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black"
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Naam"
                value={newEntity.name || ""}
                onChange={handleEntityChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black"
                required
              />
              <textarea
                name="description"
                placeholder="Beschrijving"
                value={newEntity.description || ""}
                onChange={handleEntityChange}
                className="w-full mb-4 p-2 rounded-lg border border-gray-800 text-black"
              ></textarea>
              <div className="flex justify-center space-x-4 mt-4">
                <button type="submit" className="bg-green-500 px-4 py-2 rounded-md text-white">
                  Opslaan
                </button>
                <button
                  type="button"
                  className="bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={() => setModal({ type: "" })}
                >
                  Annuleren
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal for deleting */}
      {modal.type === "delete" && modal.entity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-yellow-400 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">
              Weet je zeker dat je "{modal.entity.name}" wilt verwijderen?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-500 px-4 py-2 rounded-md text-white"
                onClick={handleDeleteEntity}
              >
                Ja
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded-md text-white"
                onClick={() => setModal({ type: "" })}
              >
                Nee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
