import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["text", "file"], default: "text" },
  content: { type: String }, // for text or file path
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    studyMaterials: [materialSchema],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
