import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import { connectDB } from './services/mongoDb.js';
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json()); // allow us to access the req.body to json used in authRoutes variable -> auth.controllers by extracting the data from body
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB(MONGO_URI);
});