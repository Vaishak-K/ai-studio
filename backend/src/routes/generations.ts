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

      const generationId = uuidv4();

      // ✅ CHANGE 1: Save ORIGINAL uploaded image
      const originalFilename = `original-${generationId}.jpg`;
      const originalFilepath = path.join(uploadsDir, originalFilename);

      await sharp(req.file.buffer)
        .resize(1920, null, { withoutEnlargement: true, fit: "inside" })
        .jpeg({ quality: 90 })
        .toFile(originalFilepath);

      // ✅ CHANGE 2: Save "generated" image (in real app, this would be AI output)
      // For demo, we use the same image but could apply filters/modifications
      const generatedFilename = `${generationId}.jpg`;
      const generatedFilepath = path.join(uploadsDir, generatedFilename);

      await sharp(req.file.buffer)
        .resize(1920, null, { withoutEnlargement: true, fit: "inside" })
        .jpeg({ quality: 90 })
        .toFile(generatedFilepath);

      // ✅ CHANGE 3: Save BOTH URLs to database
      const imageUrl = `/uploads/${generatedFilename}`;
      const originalImageUrl = `/uploads/${originalFilename}`;

      db.prepare(
        "INSERT INTO generations (id, user_id, prompt, style, image_url, original_image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).run(
        generationId,
        req.userId!,
        prompt,
        style,
        imageUrl,
        originalImageUrl,
        "completed"
      );

      // ✅ CHANGE 4: Return BOTH URLs in response
      res.status(201).json({
        id: generationId,
        prompt,
        style,
        imageUrl,
        originalImageUrl, // ← NEW: Return this too
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
