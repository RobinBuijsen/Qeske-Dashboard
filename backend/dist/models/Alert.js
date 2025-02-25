"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const User_1 = __importDefault(require("./User"));
const Alert = db_1.default.define("Alert", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    entity_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    thresholdType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    threshold: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    time_start: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: true,
    },
    time_end: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: true,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10, // Standaard 10 seconden
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
});
exports.default = Alert;
