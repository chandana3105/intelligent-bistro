require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const ordersRouter = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3001;

// Security & logging middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*", // In production, lock to your Expo app's origin
    methods: ["GET", "POST"],
  })
);
app.use(express.json({ limit: "10kb" }));

// Rate limiting — protect the AI endpoint
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // 30 requests per minute per IP
  message: { error: "Too many requests, slow down!" },
});

// Routes
app.use("/api/orders", aiLimiter, ordersRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🍽️  Bistro server running on http://localhost:${PORT}`);
  console.log(`   AI endpoint: POST http://localhost:${PORT}/api/orders/parse`);
  console.log(`   Menu:        GET  http://localhost:${PORT}/api/orders/menu`);
});
