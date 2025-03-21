"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Geen token, autorisatie geweigerd!" });
    }
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), secret);
        req.user = decoded; // Gebruik van `any` zodat TypeScript geen fouten geeft
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Ongeldig token!" });
    }
};
exports.default = authMiddleware;
