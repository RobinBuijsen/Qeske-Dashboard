"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEntityExistsInInflux = checkEntityExistsInInflux;
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
/**
 * Controleert of een entity_id bestaat in InfluxDB
 * @param entityId De entity_id die gecontroleerd moet worden
 * @returns {Promise<boolean>} True als de entity_id bestaat, anders false
 */
function checkEntityExistsInInflux(entityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const measurements = yield influx.getMeasurements();
            return measurements.includes(entityId);
        }
        catch (error) {
            console.error('❌ Fout bij ophalen van measurements uit InfluxDB:', error);
            return false;
        }
    });
}
