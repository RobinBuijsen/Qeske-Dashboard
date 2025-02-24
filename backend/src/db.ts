import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string, // Database naam
  process.env.DB_USER as string, // Gebruikersnaam
  process.env.DB_PASS as string, // Wachtwoord
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false, // Zet op true als je SQL-queries wilt zien
  }
);

export default sequelize;
