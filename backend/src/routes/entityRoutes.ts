import { Router } from "express";
import { createEntity, getEntities, getEntityById, updateEntity, deleteEntity } from "../controllers/entityController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// Alleen admins mogen entiteiten beheren
router.post("/", authMiddleware, createEntity);
router.get("/", authMiddleware, getEntities);
router.get("/:id", authMiddleware, getEntityById);
router.put("/:id", authMiddleware, updateEntity);
router.delete("/:id", authMiddleware, deleteEntity);

export default router;
