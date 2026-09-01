import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./config/openapi.js";
import authRoutes from "./modules/auth/auth.routes.js";
import mediaRoutes from "./modules/media/media.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import postsRoutes from "./modules/posts/posts.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import { mediaCleanupService } from "./modules/media/media-cleanup.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup environment variables (Monorepo root first, fallback to local backend/.env)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Core Security & Request Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static Media Serve
const uploadsPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// Interactive API Studio & Documentation (Swagger UI - Fully Self-Hosted)
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customSiteTitle: "Avian Blog - REST API Studio",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "list",
      filter: true,
    },
  }),
);

// API Feature Routes
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health Check Endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Multi-User Blog API is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 [SERVER] Running on http://localhost:${PORT}`);
  console.log(`🌐 [CORS] Accepting requests from: ${CLIENT_URL}`);
  console.log(`📁 [MEDIA] Serving static uploads from: ${uploadsPath}`);
  console.log(`📖 [STUDIO] API Studio live at: http://localhost:${PORT}/docs`);

  // Start Background Media Garbage Collector
  mediaCleanupService.startCleanupScheduler();
});

export default app;
