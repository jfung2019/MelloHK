// require('dotenv').config();
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './services/mongoDb.js';
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
// allow us to access the req.body to json used in authRoutes variable -> auth.controllers by extracting the data from body
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
const server = http.createServer(app);
// const io = new Server(server);


// // Example route
// app.get('/', (req, res) => {
//   res.send('API is running');
// });

// // TODO: Add routes, controllers, models, etc.

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);
//   // TODO: Add Socket.IO event handlers
// });

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB(MONGO_URI);
});