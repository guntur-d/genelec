import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  hash: {
    type: String,
    required: true,
  },
    resetCode: {
    type: String,
    default: null,
  },
  resetExpires: {
    type: Date,
    default: null,
  },
})

export default mongoose.models.User || mongoose.model("User", userSchema)