import express from "express";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import { getAllUsers, getMessages, sendMessages } from "../controllers/message.controller.js"

const router = express.Router();

router.get('/users', protectRoute, getAllUsers); //friend list of users
router.get('/:id', protectRoute, getMessages);
router.post('send/:id', protectRoute, sendMessages);

export default router;