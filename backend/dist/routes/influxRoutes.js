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
const express_1 = __importDefault(require("express"));
const influx_1 = __importDefault(require("../config/influx"));
const router = express_1.default.Router();
// Route om stroomdata op te halen voor de meters
router.get("/meter-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const results = yield Promise.all([
            influx_1.default.query(`SELECT LAST(value) AS last FROM "kWh" WHERE entity_id='p1_meter_locht_44_energie_import'`),
            influx_1.default.query(`SELECT LAST(value) AS last FROM "%" WHERE entity_id='electricity_maps_elektriciteitsnet_percentage_fossiele_brandstoffen'`),
            influx_1.default.query(`SELECT LAST(value) AS last FROM "%" WHERE entity_id='ups_load_2'`),
            influx_1.default.query(`SELECT LAST(value) AS last FROM "gCO2eq/kWh" WHERE entity_id='electricity_maps_co2_intensiteit'`)
        ]);
        // Zorg ervoor dat elk resultaat een array is
        const [verbruikteEnergie, zelfVerbruikZon, zelfVoorziening, co2] = results.map(r => Array.isArray(r) ? r : []);
        console.log("Query Resultaten:", { verbruikteEnergie, zelfVerbruikZon, zelfVoorziening, co2 });
        res.json({
            verbruikteEnergie: verbruikteEnergie.length > 0 ? (_b = (_a = verbruikteEnergie[0]) === null || _a === void 0 ? void 0 : _a.last) !== null && _b !== void 0 ? _b : 0 : 0,
            zelfVerbruikZon: zelfVerbruikZon.length > 0 ? Math.min(100, 100 - ((_d = (_c = zelfVerbruikZon[0]) === null || _c === void 0 ? void 0 : _c.last) !== null && _d !== void 0 ? _d : 0)) : 0,
            zelfVoorziening: zelfVoorziening.length > 0 ? Math.min(100, (_f = (_e = zelfVoorziening[0]) === null || _e === void 0 ? void 0 : _e.last) !== null && _f !== void 0 ? _f : 0) : 0,
            co2: co2.length > 0 ? Math.min(100, Math.max(0, 100 - (((_h = (_g = co2[0]) === null || _g === void 0 ? void 0 : _g.last) !== null && _h !== void 0 ? _h : 0) / 10))) : 0
        });
    }
    catch (error) {
        console.error("Fout bij ophalen van meterdata:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
