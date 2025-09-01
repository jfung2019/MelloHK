import express from "express";
import { login, logout, signup, profileUpdate, checkAuth } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = express.Router();
// Authentication routes
router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signup);
router.put('/profileUpdate', protectRoute, profileUpdate);
router.get('/check', protectRoute, checkAuth);

export default router;