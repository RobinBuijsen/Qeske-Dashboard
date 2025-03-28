import { Router } from "express";
import { getChartEntity, setChartEntity } from "../controllers/chartentityController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/chart-entity", authMiddleware, getChartEntity);
router.post("/chart-entity", authMiddleware, setChartEntity);

export default router;
