import FriendRequest from "../models/friendRequest.model.js";
import UserModel from "../models/user.model.js";

// Get all available user: use for when starting to have friends
const getAllUsers = async (req, res) => {
  try {
    const loggedInUser = req.authencatedData.user;
    const allUsers = await UserModel.find({
      $and: [
        { _id: { $ne: loggedInUser._id } }, // find all user excluding myself
        { _id: { $nin: loggedInUser.friends } } // find all user not in my friendlist
      ]
    }).select("-password");
    res.status(200).json(allUsers);
  } catch (err) {
    console.log("error in getAllUsers", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}

const getMyFriendList = async (req, res) => {
  try {
    const loggedInUserId = req.authencatedData.user._id;
    const user = await UserModel.findById(loggedInUserId).select("friends").populate("friends",
      "name profilePicture bio"
    );
    res.status(200).json(user.friends);
  } catch (err) {
    console.log("error in getMyFriendList", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}

const sendFriendRequest = async (req, res) => {
  try {
    const loggedInUserId = req.authencatedData.user._id;
    const { id: recipientId } = req.params;

    if (recipientId === loggedInUserId) return res.status(400).json({ message: "You can't sent friend request to yourself" });
    const recipient = await UserModel.findById(recipientId);
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });
    // friends -> [ userId ]
    if (recipient.friends.includes(loggedInUserId)) return res.status(400).json({ message: "User already friends" });

    const existingFriendRequest = await FriendRequest.findOne({
      $or: [
        { sender: loggedInUserId, recipient: recipientId },
        { sender: recipientId, recipient: loggedInUserId },
      ],
      status: "pending"
    });
    if (existingFriendRequest) return res.status(400).json({ message: "Friend request already been sent between you and this user" });

    const friendRequest = await FriendRequest.create({
      sender: loggedInUserId,
      recipient: recipientId
    });
    res.status(200).json(friendRequest);
  } catch (err) {
    console.log("error in sendFriendRequest", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}

const acceptFriendRequest = async (req, res) => {
  try {
    const loggedInUserId = req.authencatedData.user._id;
    const { id: friendRequestDocumentId } = req.params;

    const friendRequest = await FriendRequest.findById(friendRequestDocumentId);
    if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });
    if (friendRequest.recipient._id.toString() !== loggedInUserId.toString()) return res.status(403).json({ message: `You are not authorized to accept this request ${friendRequest}` });

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each other on the user schema friend list array
    // Add the user (friend) who sent me friend request to my friend list
    // $addToSet is a MongoDB update operator that adds a value to an array only if it does not already exist in that array (prevents duplicates).
    await UserModel.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender }
    });

    // add me to the sender friend's list
    await UserModel.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient }
    });
    res.status(200).json({ mmesage: "Friend request accepted", friendRequest});
  } catch (err) {
    console.log("error in acceptFriendRequest", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}

const getAllFriendRequests = async (req, res) => {
  try {
    const loggedInUserId = req.authencatedData.user._id;
    const allFriendRequests = await FriendRequest.find({ recipient: loggedInUserId, status: "pending" }).populate("sender",
      "bio location name profilePicture"
    );

    // accepted friend request sent by other user to me (friends)
    const acceptedFriendRequests = await FriendRequest.find({
      recipient: loggedInUserId,
      status: "accepted"
    }).populate("sender", "bio location name profilePicture");

    // accepted friend request sent by me
    const acceptedSentRequests = await FriendRequest.find({
      sender: loggedInUserId,
      status: "accepted"
    }).populate("recipient", "bio location name profilePicture");

    // outgoing friend request sent by me
    const outgoingSentFriendRequests = await FriendRequest.find({
      sender: loggedInUserId,
      status: "pending"
    }).populate("recipient", "bio location name profilePicture");
    res.status(200).json({ allFriendRequests, acceptedFriendRequests, acceptedSentRequests, outgoingSentFriendRequests});
  } catch (err) {
    console.log("error in getAllFriendRequests", err.message);
    res.status(400).json({ message: "Internal server error" });
  }
}



export { getAllUsers, getMyFriendList, sendFriendRequest, acceptFriendRequest, getAllFriendRequests };