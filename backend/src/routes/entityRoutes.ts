import { Router } from "express";
import { 
    createEntity, 
    getEntities, 
    getEntityById, 
    updateEntity, 
    deleteEntity, 
    validateEntityId,
    getEntityMeasurements 
       } from "../controllers/entityController";
import authMiddleware from "../middleware/authMiddleware";
import { getStatsForEntities, getLatestEntityValues } from "../controllers/entityController";


const router = Router();

// Alleen admins mogen entiteiten beheren
router.post("/stats", authMiddleware, getStatsForEntities);
router.post("/values", authMiddleware, getLatestEntityValues);
router.get("/data/:entity_id", authMiddleware, getEntityMeasurements);
router.get("/validate/:entity_id", authMiddleware, validateEntityId);
router.post("/", authMiddleware, createEntity);
router.get("/", authMiddleware, getEntities);
router.put("/:id", authMiddleware, updateEntity);
router.delete("/:id", authMiddleware, deleteEntity);
router.get("/:id", authMiddleware, getEntityById);

export default router;
