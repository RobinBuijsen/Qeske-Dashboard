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
exports.getEntityMeasurements = exports.validateEntityId = exports.deleteEntity = exports.updateEntity = exports.getEntityById = exports.getEntities = exports.createEntity = void 0;
const Entity_1 = __importDefault(require("../models/Entity"));
const influx_1 = __importDefault(require("../config/influx"));
// ✅ Nieuwe entiteit aanmaken (alleen admin)
const createEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen entiteiten aanmaken." });
            return;
        }
        const { entity_id, name, description } = req.body;
        if (!entity_id || !name) {
            res.status(400).json({ message: "entity_id en name zijn verplicht." });
            return;
        }
        // 🔹 Controleer of entity_id bestaat in InfluxDB
        const existsInInflux = yield checkEntityExistsInInflux(entity_id);
        if (!existsInInflux) {
            res.status(400).json({ message: `De entity_id '${entity_id}' bestaat niet in InfluxDB.` });
            return;
        }
        // 🔹 Als de entity_id wél bestaat in InfluxDB, sla op in MySQL
        const newEntity = yield Entity_1.default.create({ entity_id, name, description });
        res.status(201).json(newEntity);
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het aanmaken van een entiteit", error });
    }
});
exports.createEntity = createEntity;
// ✅ Alle entiteiten ophalen (alleen admin)
const getEntities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen entiteiten bekijken." });
            return;
        }
        const entities = yield Entity_1.default.findAll();
        res.json(entities);
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het ophalen van entiteiten", error });
    }
});
exports.getEntities = getEntities;
// ✅ Een specifieke entiteit ophalen (alleen admin)
const getEntityById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen deze entiteit bekijken." });
            return;
        }
        const { id } = req.params;
        const entity = yield Entity_1.default.findByPk(id);
        if (!entity) {
            res.status(404).json({ message: "Entiteit niet gevonden" });
            return;
        }
        res.json(entity);
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het ophalen van de entiteit", error });
    }
});
exports.getEntityById = getEntityById;
// ✅ Entiteit updaten (alleen admin)
const updateEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen entiteiten bijwerken." });
            return;
        }
        const { id } = req.params;
        const updatedEntity = yield Entity_1.default.update(req.body, { where: { id } });
        if (!updatedEntity[0]) {
            res.status(404).json({ message: "Entiteit niet gevonden" });
            return;
        }
        res.json({ message: "Entiteit succesvol bijgewerkt" });
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het bijwerken van de entiteit", error });
    }
});
exports.updateEntity = updateEntity;
// ✅ Entiteit verwijderen (alleen admin)
const deleteEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen entiteiten verwijderen." });
            return;
        }
        const { id } = req.params;
        const deleted = yield Entity_1.default.destroy({ where: { id } });
        if (!deleted) {
            res.status(404).json({ message: "Entiteit niet gevonden" });
            return;
        }
        res.json({ message: "Entiteit succesvol verwijderd" });
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het verwijderen van de entiteit", error });
    }
});
exports.deleteEntity = deleteEntity;
const validateEntityId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entity_id } = req.params;
        if (!entity_id) {
            res.status(400).json({ message: "Geen entity_id opgegeven." });
            return;
        }
        // Controleer of entity_id bestaat in InfluxDB
        const exists = yield checkEntityExistsInInflux(entity_id);
        res.json({ exists });
    }
    catch (error) {
        console.error("❌ Fout bij validatie van entity_id:", error);
        res.status(500).json({ message: "Interne serverfout", error });
    }
});
exports.validateEntityId = validateEntityId;
// ✅ Functie om te controleren of een entity_id in InfluxDB bestaat
const checkEntityExistsInInflux = (entity_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 🔹 Stap 1: Haal alle measurements op uit InfluxDB
        const measurementsResult = yield influx_1.default.query(`SHOW MEASUREMENTS`);
        const measurements = measurementsResult.map((row) => row.name);
        // 🔹 Stap 2: Controleer in elke measurement of entity_id bestaat
        for (const measurement of measurements) {
            const query = `SELECT * FROM "${measurement}" WHERE "entity_id" = '${entity_id}' LIMIT 1`;
            const result = yield influx_1.default.query(query);
            if (result.length > 0) {
                return true; // ✅ entity_id gevonden in een van de measurements
            }
        }
        console.log(`❌ entity_id "${entity_id}" niet gevonden in InfluxDB`);
        return false;
    }
    catch (error) {
        console.error("❌ Fout bij ophalen van InfluxDB gegevens:", error);
        return false;
    }
});
// ✅ Meetgegevens ophalen uit InfluxDB via entity_id
const getEntityMeasurements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { entity_id } = req.params;
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen meetgegevens bekijken." });
            return;
        }
        if (!entity_id) {
            res.status(400).json({ message: "entity_id ontbreekt." });
            return;
        }
        // 🔍 Zoek over alle measurements
        const measurementsResult = yield influx_1.default.query(`SHOW MEASUREMENTS`);
        const measurements = measurementsResult.map((row) => row.name);
        let allResults = {};
        for (const measurement of measurements) {
            const query = `SELECT mean("value") AS waarde FROM "${measurement}" WHERE "entity_id" = '${entity_id}' AND time > now() - 4h GROUP BY time(30m) FILL(null)`;
            const result = yield influx_1.default.query(query);
            if (result.length > 0) {
                allResults[measurement] = result;
            }
        }
        if (Object.keys(allResults).length === 0) {
            res.status(404).json({ message: `Geen meetgegevens gevonden voor entity_id "${entity_id}".` });
        }
        else {
            res.json(allResults);
        }
    }
    catch (error) {
        console.error("❌ Fout bij ophalen van Influx data:", error);
        res.status(500).json({ message: "Interne serverfout", error });
    }
});
exports.getEntityMeasurements = getEntityMeasurements;
