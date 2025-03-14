import express from 'express';
import influx from '../config/influx';

const router = express.Router();

// Route om stroomdata op te halen voor de meters
router.get("/meter-data", async (req, res) => {
  try {
    const results = await Promise.all([
      influx.query(`SELECT LAST(value) AS last FROM "kWh" WHERE entity_id='p1_meter_locht_44_energie_import'`),
      influx.query(`SELECT LAST(value) AS last FROM "%" WHERE entity_id='electricity_maps_elektriciteitsnet_percentage_fossiele_brandstoffen'`),
      influx.query(`SELECT LAST(value) AS last FROM "%" WHERE entity_id='ups_load_2'`),
      influx.query(`SELECT LAST(value) AS last FROM "gCO2eq/kWh" WHERE entity_id='electricity_maps_co2_intensiteit'`)
    ]);

    // Zorg ervoor dat elk resultaat een array is
    const [verbruikteEnergie, zelfVerbruikZon, zelfVoorziening, co2] = results.map(r => Array.isArray(r) ? r : []);

    console.log("Query Resultaten:", { verbruikteEnergie, zelfVerbruikZon, zelfVoorziening, co2 });

    res.json({
      verbruikteEnergie: verbruikteEnergie.length > 0 ? verbruikteEnergie[0]?.last ?? 0 : 0,
      zelfVerbruikZon: zelfVerbruikZon.length > 0 ? Math.min(100, 100 - (zelfVerbruikZon[0]?.last ?? 0)) : 0,
      zelfVoorziening: zelfVoorziening.length > 0 ? Math.min(100, zelfVoorziening[0]?.last ?? 0) : 0,
      co2: co2.length > 0 ? Math.min(100, Math.max(0, 100 - ((co2[0]?.last ?? 0) / 10))) : 0
    });

  } catch (error) {
    console.error("Fout bij ophalen van meterdata:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
