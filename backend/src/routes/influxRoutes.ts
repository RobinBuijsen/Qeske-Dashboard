import express from 'express';
import influx from '../config/influx';

const router = express.Router();

// Controleer of de router werkt
router.get('/test', (req, res) => {
  res.json({ message: "InfluxDB route werkt!" });
});

// Route om stroomdata op te halen
router.get("/power-usage", async (req, res) => {
  try {
      const result = await influx.query(`
          SELECT * FROM "W" LIMIT 10
      `);
      res.json(result);
  } catch (error) {
      console.error("Fout bij ophalen van data:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
