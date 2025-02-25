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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.approveUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
// **Gebruiker aanmaken (standaard als "user", niet direct goedgekeurd)**
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
            roleId: userRole.id,
            isApproved: false, // Nieuwe gebruikers moeten worden goedgekeurd
        });
        res.status(201).json({ message: "Gebruiker geregistreerd. Wacht op goedkeuring door een admin.", user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Fout bij aanmaken gebruiker", error });
    }
});
exports.createUser = createUser;
// **Admin keurt gebruiker goed**
const approveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // 🔹 Controleer of de aanvrager admin is
        if (!req.user || req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen accounts goedkeuren." });
            return;
        }
        // 🔹 Zoek de gebruiker in de database
        const user = yield User_1.default.findOne({ where: { id } });
        if (!user) {
            res.status(404).json({ message: "Gebruiker niet gevonden." });
            return;
        }
        // 🔹 Keur het account goed
        user.isApproved = true;
        yield user.save();
        res.json({ message: "Account succesvol goedgekeurd." });
    }
    catch (error) {
        console.error("Fout bij goedkeuren gebruiker:", error);
        res.status(500).json({ message: "Fout bij goedkeuren gebruiker", error });
    }
});
exports.approveUser = approveUser;
// **Admin haalt alle gebruikers op**
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers bekijken." });
            return;
        }
        // Pas de query aan om Role correct te includen
        const users = yield User_1.default.findAll({
            include: [
                {
                    model: Role_1.default,
                    as: "role",
                    attributes: ["name"],
                },
            ],
        });
        res.json(users);
    }
    catch (error) {
        console.error("Fout bij ophalen gebruikers:", error);
        res.status(500).json({ message: "Fout bij ophalen gebruikers", error });
    }
});
exports.getUsers = getUsers;
// **Admin haalt gebruiker op door ID**
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers bekijken." });
            return;
        }
        // 🔹 Haal de gebruiker op met de rol
        const user = yield User_1.default.findOne({
            where: { id },
            include: [
                {
                    model: Role_1.default,
                    as: "role",
                    attributes: ["name"],
                },
            ],
        });
        if (!user) {
            res.status(404).json({ message: "Gebruiker niet gevonden." });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error("Fout bij ophalen gebruiker:", error);
        res.status(500).json({ message: "Fout bij ophalen gebruiker", error });
    }
});
exports.getUserById = getUserById;
// **Admin wijzigt gebruikers**
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { first_name, last_name, username, email, password, roleId } = req.body;
        // Controleer of de aanvrager admin is
        if (!req.user || req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers wijzigen." });
            return;
        }
        // Zoek de gebruiker in de database
        const user = yield User_1.default.findOne({ where: { id } });
        if (!user) {
            res.status(404).json({ message: "Gebruiker niet gevonden." });
            return;
        }
        // Update de gegevens indien meegegeven
        if (first_name)
            user.first_name = first_name;
        if (last_name)
            user.last_name = last_name;
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        // Update het wachtwoord als het is meegegeven (hash voor veiligheid)
        if (password) {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            user.password = hashedPassword;
        }
        // Update de rol als deze is meegegeven
        if (roleId) {
            const roleExists = yield Role_1.default.findOne({ where: { id: roleId } });
            if (!roleExists) {
                res.status(400).json({ message: "Ongeldige rol ID." });
                return;
            }
            user.roleId = roleId;
        }
        // Sla de wijzigingen op
        yield user.save();
        res.json({ message: "Gebruiker succesvol bijgewerkt.", user });
    }
    catch (error) {
        console.error("Fout bij updaten gebruiker:", error);
        res.status(500).json({ message: "Fout bij updaten gebruiker", error });
    }
});
exports.updateUser = updateUser;
// **Admin verwijdert gebruikers**
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // 🔹 Controleer of de aanvrager admin is
        if (!req.user || req.user.role !== "admin") {
            res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers verwijderen." });
            return;
        }
        // 🔹 Controleer of de gebruiker bestaat
        const user = yield User_1.default.findOne({ where: { id } });
        if (!user) {
            res.status(404).json({ message: "Gebruiker niet gevonden." });
            return;
        }
        yield user.destroy(); // 🔹 Verwijder de gebruiker
        res.json({ message: "Gebruiker succesvol verwijderd." });
    }
    catch (error) {
        console.error("Fout bij verwijderen gebruiker:", error);
        res.status(500).json({ message: "Fout bij verwijderen gebruiker", error });
    }
});
exports.deleteUser = deleteUser;
