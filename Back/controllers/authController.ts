import { Request, Response } from "express";
import bcrypt from "bcrypt";

const { User } = require("../db");

export async function register(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "email, username, password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be at least 6 characters" });
    }

    const hash = await bcrypt.hash(password, 10);
    console.log("hashed password: ", hash);

    // Normalize email before creating user
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.create({ 
      email: normalizedEmail, 
      username, 
      password: hash 
    });
    console.log("user created: ", user);

    res.status(201).json({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (e: any) {
    console.error("Registration error:", e);
    // MySQL duplicate key error
    if (e?.parent?.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "email or username already exists" });
    }
    return res.status(500).json({ error: "registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    // normalize email
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    res.json({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "login failed" });
  }
}
