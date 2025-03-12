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
