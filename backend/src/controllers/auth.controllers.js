import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../services/cloudinary.js";

const signup = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    if (!email || !name || !password) return res.status(400).json({ message: "Please fill up the required fields" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be atleast 6 characters" });
    const user = await UserModel.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exist!" });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    // convert password to non readable text e.g. 12345 -> wedgadw_123ghagd#12312
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword
    });

    if (newUser) {
      // generate jwt
      generatetoken(newUser._id, res);
      // save to database
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    console.log("error in sign up controller", err.message)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const login = async (req, res) => {
  // TODO: Implement login logic
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and/or password are required" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isPassWordValid = await bcrypt.compare(password, user.password);
    if (!isPassWordValid || password.length < 6) return res.status(400).json({ message: "Invalid credentials" });
    generatetoken(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    });
  } catch (err) {
    console.log("error in sign up controller", err.message)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const logout = (req, res) => {
  try {
    // clear login cookies
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successfull!" });
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

const generatetoken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
  console.log("res", res);
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //ms
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development"
  });
  console.log("res token", token);
  return token;
}

export { login, logout, signup, profileUpdate, checkAuth };