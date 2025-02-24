import { Router } from "express";
import { register, login } from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/protected", authMiddleware, (req: any, res: any) => {
  if (!req.user) {
    return res.status(403).json({ message: "Geen toegang, geen geldige gebruiker gevonden." });
  }

  res.json({
    message: "Je hebt toegang tot deze beveiligde route!",
    user: req.user,
  });
});

export default router;
