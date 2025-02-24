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
exports.deleteAlert = exports.updateAlert = exports.getAlert = exports.getAlerts = exports.createAlert = void 0;
const Alert_1 = __importDefault(require("../models/Alert"));
// Alert aanmaken (alleen admin)
const createAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Controleer of de gebruiker een admin is
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen alerts aanmaken." });
            return;
        }
        const { type, thresholdType, threshold, message, userId } = req.body;
        const newAlert = yield Alert_1.default.create({ type, thresholdType, threshold, message, userId });
        res.status(201).json(newAlert);
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het aanmaken van een alert", error });
    }
});
exports.createAlert = createAlert;
// Alle alerts ophalen (alleen admin)
const getAlerts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen alerts bekijken." });
            return;
        }
        const alerts = yield Alert_1.default.findAll();
        res.json(alerts);
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het ophalen van alerts", error });
    }
});
exports.getAlerts = getAlerts;
// Een specifieke alert ophalen (alleen admin)
const getAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen deze alert bekijken." });
            return;
        }
        const { id } = req.params;
        const alert = yield Alert_1.default.findByPk(id);
        if (!alert) {
            res.status(404).json({ message: "Alert niet gevonden" });
            return;
        }
        res.json(alert);
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het ophalen van de alert", error });
    }
});
exports.getAlert = getAlert;
// Alert updaten (alleen admin)
const updateAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen alerts bijwerken." });
            return;
        }
        const { id } = req.params;
        const [updated] = yield Alert_1.default.update(req.body, { where: { id } });
        if (!updated) {
            res.status(404).json({ message: "Alert niet gevonden" });
            return;
        }
        res.json({ message: "Alert succesvol bijgewerkt" });
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het bijwerken van de alert", error });
    }
});
exports.updateAlert = updateAlert;
// Alert verwijderen (alleen admin)
const deleteAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins mogen alerts verwijderen." });
            return;
        }
        const { id } = req.params;
        const deleted = yield Alert_1.default.destroy({ where: { id } });
        if (!deleted) {
            res.status(404).json({ message: "Alert niet gevonden" });
            return;
        }
        res.json({ message: "Alert succesvol verwijderd" });
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij het verwijderen van de alert", error });
    }
});
exports.deleteAlert = deleteAlert;
