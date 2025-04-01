import { Request, Response } from "express";
import Entity from "../models/Entity";

// 🔹 Haal top, bottom en piechart-entiteiten op
export const getChartEntity = async (req: Request, res: Response): Promise<void> => {
  try {
    const top = await Entity.findOne({ where: { chart_position: "top" } });
    const bottom = await Entity.findOne({ where: { chart_position: "bottom" } });
    const piechartEntities = await Entity.findAll({ where: { chart_position: "piechart" } });

    res.status(200).json({
      top,
      bottom,
      piechart: piechartEntities.map(e => e.get("entity_id")), 
    });
  } catch (error) {
    console.error("Fout bij ophalen grafiek entiteiten:", error);
    res.status(500).json({ message: "Interne serverfout", error });
  }
};


// 🔹 Sla top, bottom of piechart entiteiten op
export const setChartEntity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { entity_id, position, entity_ids } = req.body;

    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen dit wijzigen." });
      return;
    }

    if (position === "piechart") {
      if (!Array.isArray(entity_ids)) {
        res.status(400).json({ message: "entity_ids moet een array zijn." });
        return;
      }

      // Zet alle vorige piechart-entiteiten terug op null
      await Entity.update({ chart_position: null }, { where: { chart_position: "piechart" } });

      // Activeer nieuwe selectie
      await Promise.all(
        entity_ids.map(id =>
          Entity.update({ chart_position: "piechart" }, { where: { entity_id: id } })
        )
      );

      res.status(200).json({ message: "Piechart entiteiten succesvol opgeslagen." });
      return;
    }

    // Voor top/bottom
    if (!entity_id || !["top", "bottom"].includes(position)) {
      res.status(400).json({ message: "entity_id en geldige position zijn verplicht" });
      return;
    }

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
