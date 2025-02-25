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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
// 🔹 Gebruiker registreren (standaard niet goedgekeurd)
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, username, email, password } = req.body;
        // Controleer of de gebruikersnaam al bestaat
        const existingUser = yield User_1.default.findOne({ where: { username } });
        if (existingUser) {
            res.status(400).json({ message: "Gebruikersnaam bestaat al" });
            return;
        }
        // Controleer of het e-mailadres al bestaat
        const existingEmail = yield User_1.default.findOne({ where: { email } });
        if (existingEmail) {
            res.status(400).json({ message: "E-mail bestaat al" });
            return;
        }
        // 🔹 Haal de standaard "user" rol op
        const userRole = yield Role_1.default.findOne({ where: { name: "user" } });
        if (!userRole) {
            res.status(500).json({ message: "Fout: Rol 'user' niet gevonden in database!" });
            return;
        }
        // Hash het wachtwoord
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Maak een nieuwe gebruiker aan (standaard niet goedgekeurd)
        const newUser = yield User_1.default.create({
            first_name,
            last_name,
            username,
            email,
            password: hashedPassword,
            roleId: userRole.id,
            isApproved: false, // ❗ Nieuwe gebruiker moet eerst worden goedgekeurd door admin
        });
        res.status(201).json({ message: "Gebruiker succesvol geregistreerd. Wacht op goedkeuring door admin.", user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Er is iets misgegaan bij de registratie.", error });
    }
});
exports.register = register;
// 🔹 Gebruiker inloggen (alleen als goedgekeurd)
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Gebruikersnaam en wachtwoord zijn verplicht!" });
            return;
        }
        const user = yield User_1.default.findOne({
            where: { username },
            include: [{ model: Role_1.default, as: "role", attributes: ["name"] }],
        });
        if (!user) {
            res.status(400).json({ message: "Ongeldige gebruikersnaam of wachtwoord" });
            return;
        }
        if (!user.isApproved) {
            res.status(403).json({ message: "Je account is nog niet goedgekeurd door een admin." });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Ongeldige gebruikersnaam of wachtwoord" });
            return;
        }
        const roleName = user.role ? user.role.name : "user";
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: roleName }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({ message: "Succesvol ingelogd!", token, user });
    }
    catch (error) {
        res.status(500).json({ message: "Er is iets misgegaan bij het inloggen.", error });
    }
});
exports.login = login;
