import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import cloudinary from "../services/cloudinary.js";

const getAllUsers = async (req, res) => {
  try {
    // const { profilePicture } = req.body;
    const loggedInUser = req.authencatedData.user._id;
    const allUsers = await UserModel.find({ _id: { $ne: loggedInUser } }).select("-password");
    res.status(200).json(allUsers);
  } catch (err) {
    console.log("error in getAllUsers", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}

const getMessages = async (req, res) => {
  try {
    // const { profilePicture } = req.body;
    const { id: recieverId } = req.params;
    const myId = req.authencatedData.user._id;
    const userMessage = await MessageModel.find({
      $or: [
        { senderId: myId, recieverId: recieverId }, // sent message to person a by me
        { senderId: recieverId, recieverId: myId } // sent message to me by person a
      ]
    });
    if (!userMessage) return res.status(400).json({ message: "Cannot find message" });
    res.status(200).json(userMessage);
  } catch (err) {
    console.log("error in getMessage", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}

const sendMessages = async (req, res) => {
  const { id: recieverId } = req.params;
  const { text, image } = req.body;
  const myId = req.authencatedData.user._id;
  try {
    let imageUrl;
    if (image) {
      const imageResponse = await cloudinary.uploader.upload(image);
      imageUrl = imageResponse.secure_url;
    }

    const newMessage = new MessageModel({
      senderId: myId,
      image: imageUrl,
      recieverId,
      text
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
    // toDo: socket.IO here for real time chat exhanges
    
  } catch (err) {
    console.log("Error in sendMessages", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}

export { getAllUsers, getMessages, sendMessages };