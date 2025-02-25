import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Role from "../models/Role";

// **Gebruiker aanmaken (standaard als "user", niet direct goedgekeurd)**
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
      isApproved: false, // Nieuwe gebruikers moeten worden goedgekeurd
    });

    res.status(201).json({ message: "Gebruiker geregistreerd. Wacht op goedkeuring door een admin.", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Fout bij aanmaken gebruiker", error });
  }
};

// **Admin keurt gebruiker goed**
export const approveUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "Gebruiker niet gevonden" });
      return;
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: "Gebruiker is goedgekeurd." });
  } catch (error) {
    res.status(500).json({ message: "Fout bij goedkeuren gebruiker", error });
  }
};

// **Admin haalt alle gebruikers op**
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

// **Admin promoot gebruiker naar admin**
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

    await User.update({ roleId: role.id }, { where: { id } });

    res.json({ message: `Gebruiker succesvol gepromoveerd naar ${newRole}` });
  } catch (error) {
    res.status(500).json({ message: "Fout bij updaten gebruiker", error });
  }
};
