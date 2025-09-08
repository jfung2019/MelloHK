import express from "express";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import { getAllUsers, getMyFriendList, sendFriendRequest, acceptFriendRequest, getAllFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();
router.use(protectRoute); // applies protectRoute for all routes below

router.get('/all-friends', getAllUsers);
router.get('/friends', getMyFriendList);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.put('/all-friend-requests', getAllFriendRequest);


export default router;