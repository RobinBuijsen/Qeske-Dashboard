import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Role from "../models/Role";

// **Gebruiker aanmaken (altijd standaard als "user")**
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    if (!first_name || !last_name || !username || !email || !password) {
      res.status(400).json({ message: "Alle velden zijn verplicht" });
      return;
    }

    const userRole = await Role.findOne({ where: { name: "user" } });
    if (!userRole) {
      res.status(500).json({ message: "Rol 'user' niet gevonden" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      roleId: userRole.id, 
    });

    res.status(201).json({ message: "Gebruiker succesvol aangemaakt!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Fout bij aanmaken gebruiker", error });
  }
};

// **Alle gebruikers ophalen (alleen admin)**
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminRole = await Role.findOne({ where: { name: "admin" } });

    if (req.user.roleId !== adminRole?.id) {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers bekijken." });
      return;
    }

    const users = await User.findAll({ include: [Role] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Fout bij ophalen gebruikers", error });
  }
};

// **Een gebruiker een admin maken (alleen admin)**
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;

    const adminRole = await Role.findOne({ where: { name: "admin" } });

    if (req.user.roleId !== adminRole?.id) {
      res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen rollen aanpassen." });
      return;
    }

    const role = await Role.findOne({ where: { name: newRole } });
    if (!role) {
      res.status(400).json({ message: "Ongeldige rol" });
      return;
    }

    const updated = await User.update({ roleId: role.id }, { where: { id } });
    if (!updated) {
      res.status(404).json({ message: "Gebruiker niet gevonden" });
      return;
    }

    res.json({ message: `Gebruiker succesvol bijgewerkt naar ${newRole}` });
  } catch (error) {
    res.status(500).json({ message: "Fout bij updaten gebruiker", error });
  }
};
