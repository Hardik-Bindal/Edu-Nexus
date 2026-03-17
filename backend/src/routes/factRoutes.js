// src/routes/factRoutes.js
import express from "express";
import { addFact, getFact } from "../controllers/factController.js";
import { protect, teacherOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Teacher adds new daily fact
router.post("/", protect, teacherOnly, addFact);

// Anyone can fetch latest fact
router.get("/", getFact);

export default router;
