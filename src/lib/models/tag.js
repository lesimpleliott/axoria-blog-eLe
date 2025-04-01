import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});

export const Tag = mongoose.models?.Tag || mongoose.model("Tag", tagSchema);
