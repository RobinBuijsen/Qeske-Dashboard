import { Request, Response } from "express";
import Entity from "../models/Entity";
import influx from "../config/influx";

// ✅ Nieuwe entiteit aanmaken (alleen admin)
export const createEntity = async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.user.role !== "admin") {
        res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen entiteiten aanmaken." });
        return;
      }
  
      const { entity_id, name, description } = req.body;
      if (!entity_id || !name) {
        res.status(400).json({ message: "entity_id en name zijn verplicht." });
        return;
      }
  
      // 🔹 Controleer of entity_id bestaat in InfluxDB
      const existsInInflux = await checkEntityExistsInInflux(entity_id);
      if (!existsInInflux) {
        res.status(400).json({ message: `De entity_id '${entity_id}' bestaat niet in InfluxDB.` });
        return;
      }
  
      // 🔹 Als de entity_id wél bestaat in InfluxDB, sla op in MySQL
      const newEntity = await Entity.create({ entity_id, name, description });
  
      res.status(201).json(newEntity);
    } catch (error) {
      res.status(500).json({ message: "Fout bij het aanmaken van een entiteit", error });
    }
  };


// ✅ Alle entiteiten ophalen
// ✅ Alle entiteiten ophalen (voor iedereen)
export const getEntities = async (req: Request, res: Response): Promise<void> => {
  try {
    const entities = await Entity.findAll();
    res.json(entities);
  } catch (error) {
    res.status(500).json({ message: "Fout bij het ophalen van entiteiten", error });
  }
};



// ✅ Een specifieke entiteit ophalen (alleen admin)
export const getEntityById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen deze entiteit bekijken." });
      return;
    }

    const { id } = req.params;
    const entity = await Entity.findByPk(id);
    if (!entity) {
      res.status(404).json({ message: "Entiteit niet gevonden" });
      return;
    }

    res.json(entity);
  } catch (error) {
    res.status(500).json({ message: "Fout bij het ophalen van de entiteit", error });
  }
};

// ✅ Entiteit updaten (alleen admin)
export const updateEntity = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen entiteiten bijwerken." });
      return;
    }

    const { id } = req.params;
    const updatedEntity = await Entity.update(req.body, { where: { id } });

    if (!updatedEntity[0]) {
      res.status(404).json({ message: "Entiteit niet gevonden" });
      return;
    }
    res.json({ message: "Entiteit succesvol bijgewerkt" });
  } catch (error) {
    res.status(500).json({ message: "Fout bij het bijwerken van de entiteit", error });
  }
};

// ✅ Entiteit verwijderen (alleen admin)
export const deleteEntity = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen entiteiten verwijderen." });
      return;
    }

    const { id } = req.params;
    const deleted = await Entity.destroy({ where: { id } });

    if (!deleted) {
      res.status(404).json({ message: "Entiteit niet gevonden" });
      return;
    }
    res.json({ message: "Entiteit succesvol verwijderd" });
  } catch (error) {
    res.status(500).json({ message: "Fout bij het verwijderen van de entiteit", error });
  }
};

export const validateEntityId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { entity_id } = req.params;

        if (!entity_id) {
            res.status(400).json({ message: "Geen entity_id opgegeven." });
            return;
        }

        // Controleer of entity_id bestaat in InfluxDB
        const exists = await checkEntityExistsInInflux(entity_id);

        res.json({ exists });
    } catch (error) {
        console.error("❌ Fout bij validatie van entity_id:", error);
        res.status(500).json({ message: "Interne serverfout", error });
    }
};


// ✅ Functie om te controleren of een entity_id in InfluxDB bestaat
const checkEntityExistsInInflux = async (entity_id: string): Promise<boolean> => {
    try {
      // 🔹 Stap 1: Haal alle measurements op uit InfluxDB
      const measurementsResult = await influx.query(`SHOW MEASUREMENTS`);
      const measurements = measurementsResult.map((row: any) => row.name);

  
      // 🔹 Stap 2: Controleer in elke measurement of entity_id bestaat
      for (const measurement of measurements) {
        const query = `SELECT * FROM "${measurement}" WHERE "entity_id" = '${entity_id}' LIMIT 1`;
        const result = await influx.query(query);
  
        if (result.length > 0) {
          return true; // ✅ entity_id gevonden in een van de measurements
        }
      }

      console.log(`❌ entity_id "${entity_id}" niet gevonden in InfluxDB`);
    return false;
  
    } catch (error) {
      console.error("❌ Fout bij ophalen van InfluxDB gegevens:", error);
      return false;
    }
  };

  // ✅ Meetgegevens ophalen (voor iedereen)
export const getEntityMeasurements = async (req: Request, res: Response): Promise<void> => {
  const { entity_id } = req.params;

  try {
    if (!entity_id) {
      res.status(400).json({ message: "entity_id ontbreekt." });
      return;
    }

    const measurementsResult = await influx.query(`SHOW MEASUREMENTS`);
    const measurements = measurementsResult.map((row: any) => row.name);

    let allResults: Record<string, any[]> = {};

    for (const measurement of measurements) {
      const query = `SELECT mean("value") AS waarde FROM "${measurement}" WHERE "entity_id" = '${entity_id}' AND time > now() - 4h GROUP BY time(30m) FILL(null)`;
      const result = await influx.query(query);

      if (result.length > 0) {
        allResults[measurement] = result;
      }
    }

    if (Object.keys(allResults).length === 0) {
      res.status(404).json({ message: `Geen meetgegevens gevonden voor entity_id "${entity_id}".` });
    } else {
      res.json(allResults);
    }
  } catch (error) {
    console.error("❌ Fout bij ophalen van Influx data:", error);
    res.status(500).json({ message: "Interne serverfout", error });
  }
};

export const getLatestEntityValues = async (req: Request, res: Response): Promise<void> => {
  try {
    const { entity_ids } = req.body;

    if (!Array.isArray(entity_ids) || entity_ids.length === 0) {
      res.status(400).json({ message: "entity_ids moet een niet-lege array zijn." });
      return;
    }

    const result: Record<string, number | null> = {};

for (const entity_id of entity_ids) {
  const measurements: { name: string }[] = await influx.query(`SHOW MEASUREMENTS`);
  let found = false;

  for (const { name: measurement } of measurements) {
    const query = `SELECT LAST("value") FROM "${measurement}" WHERE "entity_id" = '${entity_id}'`;
    const data: { last: number }[] = await influx.query(query);

    if (data.length > 0 && typeof data[0].last === "number") {
      result[entity_id] = parseFloat(data[0].last.toFixed(2));
      found = true;
      break;
    }
  }

  if (!found) result[entity_id] = null;
}


    res.json(result);
  } catch (error) {
    console.error("❌ Fout bij ophalen van actuele entity waarden:", error);
    res.status(500).json({ message: "Interne serverfout", error });
  }
};
  
  
  