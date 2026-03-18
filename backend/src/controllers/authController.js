import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verifyGoogleToken } from "../utils/firebaseAuth.js";

// Generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Google Login
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the token with Firebase Admin
    const decodedToken = await verifyGoogleToken(token);
    const { email, name, picture: avatar, user_id: googleId } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create them
    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email,
        password: null, // Google users don't use password login
        role: "student",
        googleId,
        avatar
      });
    }

    // Generate JWT
    const jwtToken = generateToken(user._id, user.role);

    res.json({
      message: "Google Login successful",
      token: jwtToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ error: "Unauthorized: Invalid Google Token" });
  }
};

// 📌 Get Profile (requires protect middleware)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
