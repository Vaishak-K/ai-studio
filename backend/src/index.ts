import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth";
import generationsRoutes from "./routes/generations";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/auth", authRoutes);
app.use("/generations", generationsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
