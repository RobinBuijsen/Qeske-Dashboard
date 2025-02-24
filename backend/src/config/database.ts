import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "qeskedashboard",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: Number(process.env.DB_PORT) || 3306,
    logging: false, // Zet op true als je SQL-queries in de console wilt zien
  }
);

// Test de database-connectie
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Verbonden met de MySQL database!");
  } catch (error) {
    console.error("❌ Kan geen verbinding maken met de database:", error);
  }
})();

export default sequelize;
