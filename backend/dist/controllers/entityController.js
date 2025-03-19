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
exports.deleteEntity = exports.updateEntity = exports.getEntityById = exports.getEntities = exports.createEntity = void 0;
const Entity_1 = __importDefault(require("../models/Entity"));
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
