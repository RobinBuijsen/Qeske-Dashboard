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
exports.setChartEntity = exports.getChartEntity = void 0;
const Entity_1 = __importDefault(require("../models/Entity"));
// 🔹 Haal top, bottom, meters en piechart-entiteiten op
const getChartEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const top = yield Entity_1.default.findOne({ where: { chart_position: "top" } });
        const bottom = yield Entity_1.default.findOne({ where: { chart_position: "bottom" } });
        const piechartEntities = yield Entity_1.default.findAll({ where: { chart_position: "piechart" } });
        const meter1 = yield Entity_1.default.findOne({ where: { chart_position: "meter1" } });
        const meter2 = yield Entity_1.default.findOne({ where: { chart_position: "meter2" } });
        const meter3 = yield Entity_1.default.findOne({ where: { chart_position: "meter3" } });
        const meter4 = yield Entity_1.default.findOne({ where: { chart_position: "meter4" } });
        res.status(200).json({
            top,
            bottom,
            piechart: piechartEntities.map(e => e.get("entity_id")),
            meters: {
                meter1: meter1 === null || meter1 === void 0 ? void 0 : meter1.get("entity_id"),
                meter2: meter2 === null || meter2 === void 0 ? void 0 : meter2.get("entity_id"),
                meter3: meter3 === null || meter3 === void 0 ? void 0 : meter3.get("entity_id"),
                meter4: meter4 === null || meter4 === void 0 ? void 0 : meter4.get("entity_id"),
            }
        });
    }
    catch (error) {
        console.error("Fout bij ophalen grafiek entiteiten:", error);
        res.status(500).json({ message: "Interne serverfout", error });
    }
});
exports.getChartEntity = getChartEntity;
// 🔹 Sla top, bottom, meterX of piechart entiteiten op
const setChartEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entity_id, position, entity_ids } = req.body;
        if (!req.user || req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen dit wijzigen." });
            return;
        }
        if (position === "piechart") {
            if (!Array.isArray(entity_ids)) {
                res.status(400).json({ message: "entity_ids moet een array zijn." });
                return;
            }
            yield Entity_1.default.update({ chart_position: null }, { where: { chart_position: "piechart" } });
            yield Promise.all(entity_ids.map(id => Entity_1.default.update({ chart_position: "piechart" }, { where: { entity_id: id } })));
            res.status(200).json({ message: "Piechart entiteiten succesvol opgeslagen." });
            return;
        }
        const allowedPositions = ["top", "bottom", "meter1", "meter2", "meter3", "meter4"];
        if (!entity_id || !allowedPositions.includes(position)) {
            res.status(400).json({ message: "entity_id en geldige position zijn verplicht" });
            return;
        }
        yield Entity_1.default.update({ chart_position: null }, { where: { chart_position: position } });
        const [updatedCount] = yield Entity_1.default.update({ chart_position: position }, { where: { entity_id } });
        if (updatedCount === 0) {
            res.status(404).json({ message: "Entiteit niet gevonden." });
            return;
        }
        res.status(200).json({ message: `Entiteit ingesteld op positie ${position}`, entity_id });
    }
    catch (error) {
        console.error("Fout bij instellen grafiek entiteit:", error);
        res.status(500).json({ message: "Fout bij opslaan grafiek entiteit", error });
    }
});
exports.setChartEntity = setChartEntity;
