import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import sequelize from "./db";
import bodyParser from "body-parser";
import alertRoutes from "./routes/alertRoutes";
import userRoutes from "./routes/userRoutes";
import entityRoutes from "./routes/entityRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api", authRoutes);
app.use("/api/entities", entityRoutes);
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;

// Database verbinden en server starten
sequelize.sync({ alter: true }).then(() => {
  console.log("Verbonden met de MySQL database!");
  app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
  });
});
