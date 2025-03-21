"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const entityController_1 = require("../controllers/entityController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const entityController_2 = require("../controllers/entityController");
const router = (0, express_1.Router)();
// Alleen admins mogen entiteiten beheren
router.post("/", authMiddleware_1.default, entityController_1.createEntity);
router.get("/", authMiddleware_1.default, entityController_1.getEntities);
router.get("/:id", authMiddleware_1.default, entityController_1.getEntityById);
router.get("/validate/:entity_id", authMiddleware_1.default, entityController_2.validateEntityId);
router.put("/:id", authMiddleware_1.default, entityController_1.updateEntity);
router.delete("/:id", authMiddleware_1.default, entityController_1.deleteEntity);
exports.default = router;
