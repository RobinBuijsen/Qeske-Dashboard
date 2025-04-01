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
  thresholdUnit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "kW",
  },
  time_start: { 
    type: DataTypes.TIME,
    allowNull: true,
  },
  time_end: { 
    type: DataTypes.TIME,
    allowNull: true,
  },
  duration: { // Hoe lang de piek moet duren voor een alert afgaat
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10, 
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
