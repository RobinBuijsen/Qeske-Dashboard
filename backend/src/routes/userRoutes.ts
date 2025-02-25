import { Router } from "express";
import { createUser, getUsers, approveUser, getUserById, updateUser, deleteUser } from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", createUser);
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById); 
router.put("/:id", authMiddleware, updateUser);
router.put("/:id/approve", authMiddleware, approveUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
