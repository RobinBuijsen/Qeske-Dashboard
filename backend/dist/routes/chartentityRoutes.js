"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chartentityController_1 = require("../controllers/chartentityController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.get("/chart-entity", authMiddleware_1.default, chartentityController_1.getChartEntity);
router.post("/chart-entity", authMiddleware_1.default, chartentityController_1.setChartEntity);
exports.default = router;
