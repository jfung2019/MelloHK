import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../services/cloudinary.js";

const signup = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !name || !password) return res.status(400).json({ message: "Please fill up the required fields" });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be atleast 6 characters" });
    const user = await UserModel.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exist, please use another email." });

    // generate random profile picture as link for newly created user as default.
    const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // hash the password
    // const salt = await bcrypt.genSalt(10); moved to user model schema
    // convert password to non readable text e.g. 12345 -> wedgadw_123ghagd#12312
    // const hashedPassword = await bcrypt.hash(password, salt); moved to user model schema

    // save to database
    const newUser = await UserModel.create({
      name,
      email,
      password,
      profilePicture: randomAvatar
    });

    // create new user for stream for getstreamio
    // generate jwt, add token and cookie to the response
    generatetoken(newUser._id, res);
    
    return res.status(201).json({
      success: true,
      user: newUser
    });
  } catch (err) {
    console.log("error in sign up controller", err.message)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and/or password are required" });
  try {
    const user = await UserModel.findOne({ email });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
    const isPassWordValid = await user.isMatchPassword(password);
    if (!isPassWordValid || password.length < 6) return res.status(400).json({ message: "Invalid credentials" });
    generatetoken(user._id, res);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.log("error in sign up controller", err.message)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout Successfull!" });
  } catch (err) {
    console.log("error in sign up controller", err.message)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const profileUpdate = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.authencatedData.user._id;
    if (!profilePicture) return res.status(400).json({ message: "Profile picture required" });
    const uploadedImage = await cloudinary.uploader.upload(profilePicture);
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePicture: uploadedImage.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("error in profileUpdate", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.authencatedData.user);
  } catch (err) {
    console.log("error in checkAuth", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}

// add token and cookie to the response
const generatetoken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
  console.log("res", res);
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //ms
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV === "production"
  });
  console.log("res token", token);
}

export { login, logout, signup, profileUpdate, checkAuth };