import { InfluxDB } from 'influx';
import dotenv from 'dotenv';

dotenv.config();

const influx = new InfluxDB({
  host: process.env.INFLUX_HOST!,
  port: Number(process.env.INFLUX_PORT!), // Gebruik de aparte poortvariabele
  database: process.env.INFLUX_DB!,
  username: process.env.INFLUX_USERNAME!,
  password: process.env.INFLUX_PASSWORD!,
  protocol: 'http', // Zorg dat het protocol correct is
});

export default influx;

/**
 * Controleert of een entity_id bestaat in InfluxDB
 * @param entityId De entity_id die gecontroleerd moet worden
 * @returns {Promise<boolean>} True als de entity_id bestaat, anders false
 */
export async function checkEntityExistsInInflux(entityId: string): Promise<boolean> {
  try {
    const measurements = await influx.getMeasurements();

    return measurements.includes(entityId);
  } catch (error) {
    console.error('❌ Fout bij ophalen van measurements uit InfluxDB:', error);
    return false;
  }
}
