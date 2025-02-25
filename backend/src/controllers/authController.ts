import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";

// 🔹 Gebruiker registreren (standaard niet goedgekeurd)
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    // Controleer of de gebruikersnaam al bestaat
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: "Gebruikersnaam bestaat al" });
      return;
    }

    // Controleer of het e-mailadres al bestaat
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      res.status(400).json({ message: "E-mail bestaat al" });
      return;
    }

    // 🔹 Haal de standaard "user" rol op
    const userRole = await Role.findOne({ where: { name: "user" } });
    if (!userRole) {
      res.status(500).json({ message: "Fout: Rol 'user' niet gevonden in database!" });
      return;
    }

    // Hash het wachtwoord
    const hashedPassword = await bcrypt.hash(password, 10);

    // Maak een nieuwe gebruiker aan (standaard niet goedgekeurd)
    const newUser = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      roleId: userRole.id,
      isApproved: false, // ❗ Nieuwe gebruiker moet eerst worden goedgekeurd door admin
    });

    res.status(201).json({ message: "Gebruiker succesvol geregistreerd. Wacht op goedkeuring door admin.", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Er is iets misgegaan bij de registratie.", error });
  }
};

// 🔹 Gebruiker inloggen (alleen als goedgekeurd)
const login = async (req: Request, res: Response): Promise<void> => {
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
    res.status(500).json({ message: "Er is iets misgegaan bij het inloggen.", error });
  }
};

// 🔹 Correcte export (voorkomt dubbele declaratie)
export { register, login };
