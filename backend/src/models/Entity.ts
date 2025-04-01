import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Entity = sequelize.define("Entity", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  entity_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  chart_position: {
    type: DataTypes.ENUM("top", "bottom", "piechart"),
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: "entities",
  timestamps: false,
});

export default Entity;
