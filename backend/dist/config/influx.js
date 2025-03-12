"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const influx_1 = require("influx");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const influx = new influx_1.InfluxDB({
    host: process.env.INFLUX_HOST,
    port: Number(process.env.INFLUX_PORT), // Gebruik de aparte poortvariabele
    database: process.env.INFLUX_DB,
    username: process.env.INFLUX_USERNAME,
    password: process.env.INFLUX_PASSWORD,
    protocol: 'http', // Zorg dat het protocol correct is
});
exports.default = influx;
