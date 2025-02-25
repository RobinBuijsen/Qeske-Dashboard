import { Router } from "express";
import { createUser, getUsers, updateUserRole, approveUser } from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", createUser);
router.get("/", authMiddleware, getUsers);
router.put("/:id/role", authMiddleware, updateUserRole);
router.put("/:id/approve", authMiddleware, approveUser);

export default router;
