// src/models/Material.js
import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true },
    gradeLevel: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String }, // if uploading PDFs/docs
  },
  { timestamps: true }
);

const Material = mongoose.model("Material", materialSchema);
export default Material;
