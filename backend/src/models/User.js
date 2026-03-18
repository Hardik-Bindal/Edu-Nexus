// src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: null },
    role: { type: String, enum: ["student", "teacher"], default: "student" },
    ecoPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: String }],
    googleId: { type: String, default: null },
    avatar: { type: String, default: null },
  },
  { timestamps: true }
);

// 🔐 Hash password before save — skip if already a bcrypt hash or if no password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  // Skip if already hashed (bcrypt hashes start with $2b$ or $2a$)
  if (this.password.startsWith("$2b$") || this.password.startsWith("$2a$")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
