// src/routes/materialRoutes.js
import express from "express";
import {
  uploadMaterial,
  getMaterials,
  requestMaterial,
} from "../controllers/materialController.js";
import { protect, teacherOnly, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Teachers upload
router.post("/", protect, teacherOnly, uploadMaterial);

// All users fetch
router.get("/", protect, getMaterials);

// Students can request AI material
router.post("/request", protect, studentOnly, requestMaterial);

export default router;
