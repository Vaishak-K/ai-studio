import express, { Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import db from "../models/database";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG files are allowed"));
    }
  },
});

const generationSchema = z.object({
  prompt: z.string().min(1).max(500),
  style: z.enum(["realistic", "artistic", "anime", "sketch"]),
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }
      console.log("Request Body:", req.body);
      const { prompt, style } = generationSchema.parse(req.body);

      // Simulate 20% error rate
      if (Math.random() < 0.2) {
        return res
          .status(503)
          .json({ error: "Model overloaded", retryable: true });
      }

      // Simulate processing delay (1-2 seconds)
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1000)
      );

      // Process and save image
      const generationId = uuidv4();
      const filename = `${generationId}.jpg`;
      const filepath = path.join(uploadsDir, filename);

      // Resize image if needed (max 1920px width)
      await sharp(req.file.buffer)
        .resize(1920, null, { withoutEnlargement: true, fit: "inside" })
        .jpeg({ quality: 90 })
        .toFile(filepath);

      // Save to database
      const imageUrl = `/uploads/${filename}`;
      db.prepare(
        "INSERT INTO generations (id, user_id, prompt, style, image_url, status) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(generationId, req.userId!, prompt, style, imageUrl, "completed");
      // console.log("Image URL:", imageUrl);
      res.status(201).json({
        id: generationId,
        prompt,
        style,
        imageUrl,
        status: "completed",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      console.error("Generation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const generations = db
      .prepare(
        "SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?"
      )
      .all(req.userId!, limit);

    res.json(generations);
  } catch (error) {
    console.error("Fetch generations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
