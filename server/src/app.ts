import express from "express";
import cors from "cors";
import path from "node:path";
import { ZodError } from "zod";
import { config } from "./config.js";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";

export const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads/demo", express.static(path.resolve(process.cwd(), "uploads", "demo")));
app.use("/uploads", express.static(config.uploadsDir));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/public", publicRouter);
app.use("/api/admin", adminRouter);

app.use(
  (error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (error instanceof ZodError) {
      response.status(400).json({
        message: "Validation failed.",
        issues: error.issues
      });
      return;
    }

    if (error instanceof SyntaxError) {
      response.status(400).json({ message: "Invalid JSON payload." });
      return;
    }

    console.error(error);
    response.status(500).json({ message: "Something went wrong." });
  }
);
