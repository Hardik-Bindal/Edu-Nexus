import Group from "../models/Group.js";
import { generateStudyMaterial } from "../utils/aiHelper.js";

// ✅ Teacher creates group
export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const group = await Group.create({ name, createdBy: req.user._id, members: [req.user._id] });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: "Error creating group", error: err.message });
  }
};

// ✅ Get groups of logged-in user
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    }).populate("members", "name email role");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching groups", error: err.message });
  }
};

// ✅ Add member (student)
export const addMember = async (req, res) => {
  try {
    const { groupId, studentId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!group.members.includes(studentId)) {
      group.members.push(studentId);
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: "Error adding member", error: err.message });
  }
};

// ✅ Teacher uploads TEXT study material
export const uploadMaterial = async (req, res) => {
  try {
    const { groupId, title, content } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.studyMaterials.push({
      title,
      type: "text",
      content,
      uploadedBy: req.user._id,
    });
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: "Error uploading material", error: err.message });
  }
};

// ✅ Teacher uploads FILE study material
export const uploadMaterialFile = async (req, res) => {
  try {
    const { groupId, title } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.studyMaterials.push({
      title: title || req.file.originalname,
      type: "file",
      content: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
    });
    await group.save();

    res.json({ message: "File uploaded successfully", group });
  } catch (err) {
    res.status(500).json({ message: "Error uploading file", error: err.message });
  }
};

// ✅ Student requests AI-generated material
export const requestMaterialFromAI = async (req, res) => {
  try {
    const { topic, level } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: "topic is required" });
    }

    const notes = await generateStudyMaterial(topic.trim(), level || "school");
    res.json({ topic, notes });
  } catch (err) {
    res.status(500).json({ message: "Error generating AI material", error: err.message });
  }
};
