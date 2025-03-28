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
        const entity = yield Entity_1.default.findOne({ where: { is_chart_entity: true } });
        if (!entity) {
            res.status(404).json({ message: "Geen actieve grafiek entiteit gevonden." });
            return;
        }
        res.status(200).json(entity);
    }
    catch (error) {
        console.error("Fout bij ophalen grafiek entiteit:", error);
        res.status(500).json({ message: "Interne serverfout", error });
    }
});
exports.getChartEntity = getChartEntity;
// 🔹 Stel een nieuwe entiteit in voor de grafiek (alleen admin)
const setChartEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entity_id } = req.body;
        if (!entity_id) {
            res.status(400).json({ message: "entity_id is verplicht" });
            return;
        }
        // 🔐 Alleen admins mogen dit doen
        if (!req.user || req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen dit wijzigen." });
            return;
        }
        // 🔄 Zet alle entiteiten uit
        yield Entity_1.default.update({ is_chart_entity: false }, { where: {} });
        // ✅ Zet geselecteerde entiteit aan
        const [updatedCount] = yield Entity_1.default.update({ is_chart_entity: true }, { where: { entity_id } });
        if (updatedCount === 0) {
            res.status(404).json({ message: "Entiteit niet gevonden." });
            return;
        }
        res.status(200).json({ message: "Grafiek entiteit succesvol ingesteld", entity_id });
    }
    catch (error) {
        console.error("Fout bij instellen grafiek entiteit:", error);
        res.status(500).json({ message: "Fout bij opslaan grafiek entiteit", error });
    }
});
exports.setChartEntity = setChartEntity;
