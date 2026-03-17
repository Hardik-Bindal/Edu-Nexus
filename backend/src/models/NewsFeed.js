import mongoose from "mongoose";

const newsFeedSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: { type: String, unique:true},
  category: String,
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("NewsFeed", newsFeedSchema);
