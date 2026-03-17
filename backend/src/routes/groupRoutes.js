import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createGroup,
  getMyGroups,
  addMember,
  uploadMaterial,
  requestMaterialFromAI,
  uploadMaterialFile,
} from "../controllers/groupController.js";
import { protect, teacherOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// Routes
router.post("/", protect, teacherOnly, createGroup);
router.get("/", protect, getMyGroups);
router.post("/add-member", protect, teacherOnly, addMember);
router.post("/material", protect, teacherOnly, uploadMaterial);
router.post("/upload-file", protect, teacherOnly, upload.single("file"), uploadMaterialFile);
router.post("/ai-material", protect, requestMaterialFromAI);

export default router;
