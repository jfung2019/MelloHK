import express from "express";
import { login, logout, signup, profileUpdate, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = express.Router();
// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// use protect route if we only want user to access pages if they are authenticated
router.put('/profileUpdate', protectRoute, profileUpdate);
router.get('/check', protectRoute, checkAuth);

export default router;