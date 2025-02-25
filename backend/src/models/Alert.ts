import { DataTypes } from "sequelize";
import db from "../db"; 
import User from "./User";

const Alert = db.define("Alert", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  entity_id: { // 🔹 Nieuwe kolom voor entiteiten in plaats van type
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  thresholdType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  threshold: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  time_start: { // 🔹 Nieuw: tijdsgebonden alerts
    type: DataTypes.TIME,
    allowNull: true,
  },
  time_end: { // 🔹 Nieuw: einde van de alert tijd
    type: DataTypes.TIME,
    allowNull: true,
  },
  duration: { // 🔹 Nieuw: hoe lang de piek moet duren voor een alert afgaat
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10, // Standaard 10 seconden
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Alert;
