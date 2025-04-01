import { Request, Response } from "express";
import Entity from "../models/Entity";

// 🔹 Haal de huidige entiteit op die voor de grafiek wordt gebruikt
export const getChartEntity = async (req: Request, res: Response): Promise<void> => {
  try {
    const top = await Entity.findOne({ where: { chart_position: "top" } });
    const bottom = await Entity.findOne({ where: { chart_position: "bottom" } });

    res.status(200).json({ top, bottom });
  } catch (error) {
    console.error("Fout bij ophalen grafiek entiteiten:", error);
    res.status(500).json({ message: "Interne serverfout", error });
  }
};

// 🔹 Stel een nieuwe entiteit in voor de grafiek (alleen admin)
export const setChartEntity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { entity_id, position } = req.body;

    if (!entity_id || !["top", "bottom"].includes(position)) {
      res.status(400).json({ message: "entity_id en geldige position zijn verplicht" });
      return;
    }

    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen dit wijzigen." });
      return;
    }

    // Verwijder vorige selectie op die positie
    await Entity.update({ chart_position: null }, { where: { chart_position: position } });

    const [updatedCount] = await Entity.update(
      { chart_position: position },
      { where: { entity_id } }
    );

    if (updatedCount === 0) {
      res.status(404).json({ message: "Entiteit niet gevonden." });
      return;
    }

    res.status(200).json({ message: `Entiteit ingesteld op positie ${position}`, entity_id });
  } catch (error) {
    console.error("Fout bij instellen grafiek entiteit:", error);
    res.status(500).json({ message: "Fout bij opslaan grafiek entiteit", error });
  }
};
