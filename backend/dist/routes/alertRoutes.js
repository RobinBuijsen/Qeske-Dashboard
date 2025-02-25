"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alertController_1 = require("../controllers/alertController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
// Alleen admins mogen alerts beheren
router.post("/", authMiddleware_1.default, alertController_1.createAlert);
router.get("/", authMiddleware_1.default, alertController_1.getAlerts);
router.get("/:id", authMiddleware_1.default, alertController_1.getAlert);
router.put("/:id", authMiddleware_1.default, alertController_1.updateAlert);
router.delete("/:id", authMiddleware_1.default, alertController_1.deleteAlert);
exports.default = router;
