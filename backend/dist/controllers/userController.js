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
exports.updateUserRole = exports.getUsers = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
// **Gebruiker aanmaken (altijd standaard als "user")**
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, username, email, password } = req.body;
        if (!first_name || !last_name || !username || !email || !password) {
            res.status(400).json({ message: "Alle velden zijn verplicht" });
            return;
        }
        const userRole = yield Role_1.default.findOne({ where: { name: "user" } });
        if (!userRole) {
            res.status(500).json({ message: "Rol 'user' niet gevonden" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield User_1.default.create({
            first_name,
            last_name,
            username,
            email,
            password: hashedPassword,
            roleId: userRole.id, // Standaard rol 'user'
        });
        res.status(201).json({ message: "Gebruiker succesvol aangemaakt!", user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij aanmaken gebruiker", error });
    }
});
exports.createUser = createUser;
// **Alle gebruikers ophalen (alleen admin)**
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminRole = yield Role_1.default.findOne({ where: { name: "admin" } });
        if (req.user.roleId !== (adminRole === null || adminRole === void 0 ? void 0 : adminRole.id)) {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers bekijken." });
            return;
        }
        const users = yield User_1.default.findAll({ include: [Role_1.default] });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij ophalen gebruikers", error });
    }
});
exports.getUsers = getUsers;
// **Een gebruiker een admin maken (alleen admin)**
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { newRole } = req.body;
        const adminRole = yield Role_1.default.findOne({ where: { name: "admin" } });
        if (req.user.roleId !== (adminRole === null || adminRole === void 0 ? void 0 : adminRole.id)) {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen rollen aanpassen." });
            return;
        }
        const role = yield Role_1.default.findOne({ where: { name: newRole } });
        if (!role) {
            res.status(400).json({ message: "Ongeldige rol" });
            return;
        }
        const updated = yield User_1.default.update({ roleId: role.id }, { where: { id } });
        if (!updated) {
            res.status(404).json({ message: "Gebruiker niet gevonden" });
            return;
        }
        res.json({ message: `Gebruiker succesvol bijgewerkt naar ${newRole}` });
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij updaten gebruiker", error });
    }
});
exports.updateUserRole = updateUserRole;
