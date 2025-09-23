import { createStreamUserToken } from "../services/streamChat.js";

const getStreamToken = async (req, res) => {
  const userId = req.authencatedData.user._id;
  const token = await createStreamUserToken(userId);
  if (!token) return res.status(404).json({ message: "Stream Token not found" });
  res.status(200).json(token);
};

export { getStreamToken };