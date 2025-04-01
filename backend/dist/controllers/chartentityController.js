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
// 🔹 Haal de huidige entiteit op die voor de grafiek wordt gebruikt
const getChartEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const top = yield Entity_1.default.findOne({ where: { chart_position: "top" } });
        const bottom = yield Entity_1.default.findOne({ where: { chart_position: "bottom" } });
        res.status(200).json({ top, bottom });
    }
    catch (error) {
        console.error("Fout bij ophalen grafiek entiteiten:", error);
        res.status(500).json({ message: "Interne serverfout", error });
    }
});
exports.getChartEntity = getChartEntity;
// 🔹 Stel een nieuwe entiteit in voor de grafiek (alleen admin)
const setChartEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entity_id, position } = req.body;
        if (!entity_id || !["top", "bottom"].includes(position)) {
            res.status(400).json({ message: "entity_id en geldige position zijn verplicht" });
            return;
        }
        if (!req.user || req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen dit wijzigen." });
            return;
        }
        // Verwijder vorige selectie op die positie
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
