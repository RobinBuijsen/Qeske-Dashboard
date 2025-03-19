import { Request, Response } from "express";
import Entity from "../models/Entity";

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

    const newEntity = await Entity.create({ entity_id, name, description });

    res.status(201).json(newEntity);
  } catch (error) {
    res.status(500).json({ message: "Fout bij het aanmaken van een entiteit", error });
  }
};

// ✅ Alle entiteiten ophalen (alleen admin)
export const getEntities = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen entiteiten bekijken." });
      return;
    }

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
