import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Gebruikersnaam en wachtwoord zijn verplicht!" });
      return;
    }

    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: "role", attributes: ["name"] }],
    });

    if (!user) {
      res.status(400).json({ message: "Ongeldige gebruikersnaam of wachtwoord" });
      return;
    }

    if (!user.isApproved) {
      res.status(403).json({ message: "Je account is nog niet goedgekeurd door een admin." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Ongeldige gebruikersnaam of wachtwoord" });
      return;
    }

    const roleName = user.role ? user.role.name : "user";
    const token = jwt.sign(
      { id: user.id, username: user.username, role: roleName },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Succesvol ingelogd!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Er is iets misgegaan", error });
  }
};
