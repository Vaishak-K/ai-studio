import express from "express";
import {
  createGeneration,
  getGenerations,
} from "../controllers/generations.controller";
import { authMiddleware } from "../middleware/auth";
import multer from "multer"; // Import multer for file handling

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authMiddleware, upload.single("image"), createGeneration);

// Route for getting generations
router.get("/", authMiddleware, getGenerations);

export default router;
