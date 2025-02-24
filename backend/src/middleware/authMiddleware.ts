import { NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: any, res: any, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Geen token, autorisatie geweigerd!" });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token.replace("Bearer ", ""), secret);

    req.user = decoded; // Gebruik van `any` zodat TypeScript geen fouten geeft
    next();
  } catch (error) {
    res.status(401).json({ message: "Ongeldig token!" });
  }
};

export default authMiddleware;
