import { Router } from "express";
import { getCurrentWeather } from "../controllers/weatherController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/current", authMiddleware, getCurrentWeather);

export default router;
