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
exports.getCurrentWeather = void 0;
const influx_1 = __importDefault(require("../config/influx"));
const getCurrentWeather = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const query = `
        SELECT 
          LAST("temperature") AS temperature,
          LAST("pressure") AS pressure,
          LAST("humidity") AS humidity,
          LAST("wind_speed") AS wind_speed,
          LAST("value") AS precipitation,
          LAST("state") AS state
        FROM "state"
        WHERE "entity_id" = 'forecast_qeske_q2'
      `;
        const results = yield influx_1.default.query(query);
        if (!results || results.length === 0) {
            res.status(404).json({ message: "Geen weerdata gevonden." });
            return;
        }
        const weather = results[0];
        res.json({
            temperature: (_a = weather.temperature) !== null && _a !== void 0 ? _a : null,
            pressure: (_b = weather.pressure) !== null && _b !== void 0 ? _b : null,
            humidity: (_c = weather.humidity) !== null && _c !== void 0 ? _c : null,
            wind_speed: (_d = weather.wind_speed) !== null && _d !== void 0 ? _d : null,
            precipitation: (_e = weather.precipitation) !== null && _e !== void 0 ? _e : null,
            state: (_f = weather.state) !== null && _f !== void 0 ? _f : "Onbekend",
        });
    }
    catch (error) {
        console.error("Fout bij ophalen weerdata:", error);
        res.status(500).json({ message: "Interne serverfout bij ophalen weerdata." });
    }
});
exports.getCurrentWeather = getCurrentWeather;
