"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.post("/login", authController_1.login);
router.post("/register", authController_1.register);
router.get("/protected", authMiddleware_1.default, (req, res) => {
    if (!req.user) {
        return res.status(403).json({ message: "Geen toegang, geen geldige gebruiker gevonden." });
    }
    res.json({
        message: "Je hebt toegang tot deze beveiligde route!",
        user: req.user,
    });
});
exports.default = router;
