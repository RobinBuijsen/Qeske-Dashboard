import { Router } from "express";
import {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  deleteAlert,
} from "../controllers/alertController";
import authMiddleware from "../middleware/authMiddleware"; // Zorgt voor authenticatie

const router = Router();

// 🛠 Alleen admins kunnen alerts beheren
router.post("/", authMiddleware, createAlert);
router.get("/", authMiddleware, getAlerts);
router.get("/:id", authMiddleware, getAlert);
router.put("/:id", authMiddleware, updateAlert);
router.delete("/:id", authMiddleware, deleteAlert);

export default router;
