import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import db from "../models/database";
import { generateToken } from "../middleware/auth";

const router = express.Router();

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password } = signupSchema.parse(req.body);

    // Check if user exists
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = db
      .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
      .run(email, passwordHash);

    const token = generateToken(result.lastInsertRowid as number);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: result.lastInsertRowid, email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
