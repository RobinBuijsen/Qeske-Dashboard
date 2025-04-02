import { Request, Response, NextFunction } from "express";
import influx from "../config/influx";

export const getCurrentWeather = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = `
        SELECT 
          LAST("temperature") AS temperature,
          LAST("pressure") AS pressure,
          LAST("humidity") AS humidity,
          LAST("wind_speed") AS wind_speed,
          LAST("value") AS precipitation,
          LAST("state") AS state
        FROM "state"
        WHERE "entity_id" = 'forecast_qeske_q2'
      `;
  
      const results = await influx.query(query);
      if (!results || results.length === 0) {
        res.status(404).json({ message: "Geen weerdata gevonden." });
        return;
      }
  
      const weather = results[0] as {
        temperature?: number;
        pressure?: number;
        humidity?: number;
        wind_speed?: number;
        precipitation?: number;
        state?: string;
      };
  
      res.json({
        temperature: weather.temperature ?? null,
        pressure: weather.pressure ?? null,
        humidity: weather.humidity ?? null,
        wind_speed: weather.wind_speed ?? null,
        precipitation: weather.precipitation ?? null,
        state: weather.state ?? "Onbekend",
      });
    } catch (error) {
      console.error("Fout bij ophalen weerdata:", error);
      res.status(500).json({ message: "Interne serverfout bij ophalen weerdata." });
    }
  };
  
