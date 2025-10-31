import { Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { z } from "zod";
import db from "../models/database";
import { AuthRequest } from "../middleware/auth";

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
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

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Controller for handling image upload and generation
export const createGeneration = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("File:", req.file ? "Present" : "Missing");

    if (!req.file) {
      res.status(400).json({ error: "No image provided" });
      return;
    }

    const { prompt, style } = generationSchema.parse(req.body);

    // Simulate 20% error rate
    if (Math.random() < 0.2) {
      res.status(503).json({ error: "Model overloaded", retryable: true });
      return;
    }

    // Simulate processing delay (1-2 seconds)
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    const generationId = uuidv4();

    // Save ORIGINAL uploaded image
    const originalFilename = `original-${generationId}.jpg`;
    const originalFilepath = path.join(uploadsDir, originalFilename);

    console.log("Saving original image to:", originalFilepath);

    await sharp(req.file.buffer)
      .resize(1920, null, { withoutEnlargement: true, fit: "inside" })
      .jpeg({ quality: 90 })
      .toFile(originalFilepath);

    // Save "generated" image
    const generatedFilename = `${generationId}.jpg`;
    const generatedFilepath = path.join(uploadsDir, generatedFilename);

    console.log("Saving generated image to:", generatedFilepath);

    await sharp(req.file.buffer)
      .resize(1920, null, { withoutEnlargement: true, fit: "inside" })
      .jpeg({ quality: 90 })
      .toFile(generatedFilepath);

    // Create URLs
    const imageUrl = `/uploads/${generatedFilename}`;
    const originalImageUrl = `/uploads/${originalFilename}`;

    console.log("Image URL:", imageUrl);
    console.log("Original Image URL:", originalImageUrl);

    // Insert into database
    const insertQuery = `
      INSERT INTO generations 
      (id, user_id, prompt, style, image_url, original_image_url, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    console.log("Executing insert with values:", {
      id: generationId,
      userId: req.userId,
      prompt,
      style,
      imageUrl,
      originalImageUrl,
      status: "completed",
    });

    db.prepare(insertQuery).run(
      generationId,
      req.userId!,
      prompt,
      style,
      imageUrl,
      originalImageUrl,
      "completed"
    );

    console.log("✓ Generation saved successfully");

    // Return response
    res.status(201).json({
      id: generationId,
      prompt,
      style,
      imageUrl,
      originalImageUrl,
      status: "completed",
      createdAt: new Date().toISOString(),
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      res.status(400).json({ error: error.issues });
      return;
    }
    console.error("Generation error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// Controller for fetching generations
export const getGenerations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const generations = db
      .prepare(
        "SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?"
      )
      .all(req.userId!, limit);

    console.log(
      `Found ${generations.length} generations for user ${req.userId}`
    );

    res.json(generations);
    return;
  } catch (error) {
    console.error("Fetch generations error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
