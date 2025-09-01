import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    profilePicture: { type: String, default: "" },
    // createdAt: { type: Date, default: Date.now },
    // UpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const UserModel = mongoose.model("User", userSchema);

export default UserModel;