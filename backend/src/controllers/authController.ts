import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role"; // 🔹 Zorg ervoor dat Role correct is geïmporteerd

// 🔹 Gebruiker registreren
export const register = async (req: Request, res: Response): Promise<void> => {
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

    // Maak een nieuwe gebruiker aan met de standaard user role
    const newUser = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword, // Veilig opgeslagen wachtwoord
      roleId: userRole.id, // 🔹 Stelt automatisch de user rol in
    });

    res.status(201).json({ message: "Gebruiker succesvol geregistreerd!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Er is iets misgegaan", error });
  }
};

// 🔹 Gebruiker inloggen met gebruikersnaam en wachtwoord
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Login verzoek ontvangen:", req.body);

    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Gebruikersnaam en wachtwoord zijn verplicht!" });
      return;
    }

    console.log(`Zoeken naar gebruiker: ${username}`);
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: "role", attributes: ["name"] }],
    });

    if (!user) {
      console.log("Gebruiker niet gevonden");
      res.status(400).json({ message: "Ongeldige gebruikersnaam of wachtwoord" });
      return;
    }

    console.log("Gebruiker gevonden:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Wachtwoord komt niet overeen");
      res.status(400).json({ message: "Ongeldige gebruikersnaam of wachtwoord" });
      return;
    }

    console.log("Gebruiker succesvol geverifieerd");

    // 🔹 Haal de rol op uit de Role tabel
    const roleName = user.role ? user.role.name : "user";

    const token = jwt.sign(
      { id: user.id, username: user.username, role: roleName },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    console.log("JWT Token gegenereerd:", token);
    res.status(200).json({ message: "Succesvol ingelogd!", token, user });
  } catch (error) {
    console.error("Login fout:", error);
    res.status(500).json({ message: "Er is iets misgegaan", error });
  }
};
