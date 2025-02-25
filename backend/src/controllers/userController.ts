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
  
      // 🔹 Controleer of de aanvrager admin is
      if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen accounts goedkeuren." });
        return;
      }
  
      // 🔹 Zoek de gebruiker in de database
      const user = await User.findOne({ where: { id } });
  
      if (!user) {
        res.status(404).json({ message: "Gebruiker niet gevonden." });
        return;
      }
  
      // 🔹 Keur het account goed
      user.isApproved = true;
      await user.save();
  
      res.json({ message: "Account succesvol goedgekeurd." });
    } catch (error) {
      console.error("Fout bij goedkeuren gebruiker:", error);
      res.status(500).json({ message: "Fout bij goedkeuren gebruiker", error });
    }
  };

// **Admin haalt alle gebruikers op**
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.user.role !== "admin") {
        res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers bekijken." });
        return;
      }
  
      // Pas de query aan om Role correct te includen
      const users = await User.findAll({
        include: [
          {
            model: Role,
            as: "role", 
            attributes: ["name"], 
          },
        ],
      });
  
      res.json(users);
    } catch (error) {
      console.error("Fout bij ophalen gebruikers:", error);
      res.status(500).json({ message: "Fout bij ophalen gebruikers", error });
    }
  };

// **Admin haalt gebruiker op door ID**
  export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      if (req.user.role !== "admin") { 
        res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers bekijken." });
        return;
      }
  
      // 🔹 Haal de gebruiker op met de rol
      const user = await User.findOne({
        where: { id },
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["name"],
          },
        ],
      });
  
      if (!user) {
        res.status(404).json({ message: "Gebruiker niet gevonden." });
        return;
      }
  
      res.json(user);
    } catch (error) {
      console.error("Fout bij ophalen gebruiker:", error);
      res.status(500).json({ message: "Fout bij ophalen gebruiker", error });
    }
  };

// **Admin wijzigt gebruikers**
  export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { first_name, last_name, username, email, password, roleId } = req.body;
  
      // Controleer of de aanvrager admin is
      if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers wijzigen." });
        return;
      }
  
      // Zoek de gebruiker in de database
      const user = await User.findOne({ where: { id } });
  
      if (!user) {
        res.status(404).json({ message: "Gebruiker niet gevonden." });
        return;
      }
  
      // Update de gegevens indien meegegeven
      if (first_name) user.first_name = first_name;
      if (last_name) user.last_name = last_name;
      if (username) user.username = username;
      if (email) user.email = email;
  
      // Update het wachtwoord als het is meegegeven (hash voor veiligheid)
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      // Update de rol als deze is meegegeven
      if (roleId) {
        const roleExists = await Role.findOne({ where: { id: roleId } });
        if (!roleExists) {
          res.status(400).json({ message: "Ongeldige rol ID." });
          return;
        }
        user.roleId = roleId;
      }
  
      // Sla de wijzigingen op
      await user.save();
  
      res.json({ message: "Gebruiker succesvol bijgewerkt.", user });
    } catch (error) {
      console.error("Fout bij updaten gebruiker:", error);
      res.status(500).json({ message: "Fout bij updaten gebruiker", error });
    }
  };

// **Admin verwijdert gebruikers**
  export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      // 🔹 Controleer of de aanvrager admin is
      if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Toegang geweigerd: alleen admins kunnen gebruikers verwijderen." });
        return;
      }
  
      // 🔹 Controleer of de gebruiker bestaat
      const user = await User.findOne({ where: { id } });
  
      if (!user) {
        res.status(404).json({ message: "Gebruiker niet gevonden." });
        return;
      }
  
      await user.destroy(); // 🔹 Verwijder de gebruiker
  
      res.json({ message: "Gebruiker succesvol verwijderd." });
    } catch (error) {
      console.error("Fout bij verwijderen gebruiker:", error);
      res.status(500).json({ message: "Fout bij verwijderen gebruiker", error });
    }
  };
  