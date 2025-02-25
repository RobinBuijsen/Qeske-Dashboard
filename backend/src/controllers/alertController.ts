import { Request, Response } from "express";
import Alert from "../models/Alert";

// 🔹 Alert aanmaken (alleen admin)
export const createAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen alerts aanmaken." });
      return;
    }

    const { entity_id, thresholdType, threshold, message, userId, time_start, time_end, duration } = req.body;

    if (!entity_id || !thresholdType || !threshold || !message || !duration) {
      res.status(400).json({ message: "Alle velden behalve 'time_start' en 'time_end' zijn verplicht." });
      return;
    }

    const newAlert = await Alert.create({ entity_id, thresholdType, threshold, message, userId, time_start, time_end, duration });

    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ message: "Fout bij het aanmaken van een alert", error });
  }
};

// 🔹 Alle alerts ophalen (alleen admin)
export const getAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen alerts bekijken." });
      return;
    }

    const alerts = await Alert.findAll();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Fout bij het ophalen van alerts", error });
  }
};

// 🔹 Een specifieke alert ophalen (alleen admin)
export const getAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen deze alert bekijken." });
      return;
    }

    const { id } = req.params;
    const alert = await Alert.findByPk(id);
    if (!alert) {
      res.status(404).json({ message: "Alert niet gevonden" });
      return;
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: "Fout bij het ophalen van de alert", error });
  }
};

// 🔹 Alert updaten (alleen admin)
export const updateAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen alerts bijwerken." });
      return;
    }

    const { id } = req.params;
    const updatedAlert = await Alert.update(req.body, { where: { id } });

    if (!updatedAlert[0]) {
      res.status(404).json({ message: "Alert niet gevonden" });
      return;
    }
    res.json({ message: "Alert succesvol bijgewerkt" });
  } catch (error) {
    res.status(500).json({ message: "Fout bij het bijwerken van de alert", error });
  }
};

// 🔹 Alert verwijderen (alleen admin)
export const deleteAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen alerts verwijderen." });
      return;
    }

    const { id } = req.params;
    const deleted = await Alert.destroy({ where: { id } });

    if (!deleted) {
      res.status(404).json({ message: "Alert niet gevonden" });
      return;
    }
    res.json({ message: "Alert succesvol verwijderd" });
  } catch (error) {
    res.status(500).json({ message: "Fout bij het verwijderen van de alert", error });
  }
};
