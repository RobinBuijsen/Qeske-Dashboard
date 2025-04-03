"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Entity = database_1.default.define("Entity", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    entity_id: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    chart_position: {
        type: sequelize_1.DataTypes.ENUM("top", "bottom", "piechart", "meter1", "meter2", "meter3", "meter4"),
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: "entities",
    timestamps: false,
});
exports.default = Entity;
