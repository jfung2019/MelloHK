import { StreamChat } from 'stream-chat';
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const streamChatClient = StreamChat.getInstance(apiKey, apiSecret);

export const createOrUpdateStreamUser = async (userData) => {
  try {
    // create or update the user
    await streamChatClient.upsertUser(userData);
    // returns the origial userData for use
    return userData;
  } catch (err) {
    console.log("error in CreateStreamUser", err)
  }
}

export const createStreamUserToken = async (userId) => {
  try {
    return streamChatClient.createToken(userId.toString());
  } catch (err) {
    console.log("error in createStreamUserToken", err)
  }
}