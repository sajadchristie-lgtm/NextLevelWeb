import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { config } from "../config.js";

const uploadsDir = config.uploadsDir;
const carsDir = path.join(uploadsDir, "cars");
const brandingDir = path.join(uploadsDir, "branding");

fs.mkdirSync(carsDir, { recursive: true });
fs.mkdirSync(brandingDir, { recursive: true });

function sanitizeBaseName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    const monthFolder = new Date().toISOString().slice(0, 7);
    const destination = path.join(carsDir, monthFolder);
    fs.mkdirSync(destination, { recursive: true });
    callback(null, destination);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    callback(null, `${Date.now()}-${sanitizeBaseName(basename)}${extension}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Only image uploads are allowed."));
      return;
    }

    callback(null, true);
  }
});

const brandingStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    fs.mkdirSync(brandingDir, { recursive: true });
    callback(null, brandingDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    callback(null, `${Date.now()}-${sanitizeBaseName(basename)}${extension}`);
  }
});

export const brandingUpload = multer({
  storage: brandingStorage,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1
  },
  fileFilter: (_req, file, callback) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.mimetype)) {
      callback(new Error("Only PNG, JPG, WEBP, or SVG uploads are allowed."));
      return;
    }
    callback(null, true);
  }
});

export async function removeBrandingFile(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/branding/")) {
    return;
  }
  const absolutePath = path.join(uploadsDir, imageUrl.replace(/^\/uploads\//, ""));
  await fs.promises.unlink(absolutePath).catch(() => undefined);
}

export function toPublicUploadPath(filePath: string) {
  const relativePath = path.relative(uploadsDir, filePath).replaceAll("\\", "/");
  return `/uploads/${relativePath}`;
}

export async function removeUploadedFile(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/cars/")) {
    return;
  }

  const absolutePath = path.join(uploadsDir, imageUrl.replace(/^\/uploads\//, ""));
  await fs.promises.unlink(absolutePath).catch(() => undefined);
}
