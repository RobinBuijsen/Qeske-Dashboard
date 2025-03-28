import { Request, Response } from "express";
import Entity from "../models/Entity";

// 🔹 Haal de huidige entiteit op die voor de grafiek wordt gebruikt
export const getChartEntity = async (req: Request, res: Response): Promise<void> => {
  try {
    const entity = await Entity.findOne({ where: { is_chart_entity: true } });

    if (!entity) {
      res.status(404).json({ message: "Geen actieve grafiek entiteit gevonden." });
      return;
    }

    res.status(200).json(entity);
  } catch (error) {
    console.error("Fout bij ophalen grafiek entiteit:", error);
    res.status(500).json({ message: "Interne serverfout", error });
  }
};

// 🔹 Stel een nieuwe entiteit in voor de grafiek (alleen admin)
export const setChartEntity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { entity_id } = req.body;

    if (!entity_id) {
      res.status(400).json({ message: "entity_id is verplicht" });
      return;
    }

    // 🔐 Alleen admins mogen dit doen
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen dit wijzigen." });
      return;
    }

    // 🔄 Zet alle entiteiten uit
    await Entity.update({ is_chart_entity: false }, { where: {} });

    // ✅ Zet geselecteerde entiteit aan
    const [updatedCount] = await Entity.update(
      { is_chart_entity: true },
      { where: { entity_id } }
    );

    if (updatedCount === 0) {
      res.status(404).json({ message: "Entiteit niet gevonden." });
      return;
    }

    res.status(200).json({ message: "Grafiek entiteit succesvol ingesteld", entity_id });
  } catch (error) {
    console.error("Fout bij instellen grafiek entiteit:", error);
    res.status(500).json({ message: "Fout bij opslaan grafiek entiteit", error });
  }
};
