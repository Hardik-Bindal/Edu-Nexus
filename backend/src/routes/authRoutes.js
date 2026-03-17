import express from "express";
import { register, login, getProfile, googleLogin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/profile", protect, getProfile);
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});

export default router;


