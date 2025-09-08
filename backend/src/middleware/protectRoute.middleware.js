import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next)=> {
  try {
    // toDo: getting user id from the token
    // decode the token using cookie-parser so we can access req.cookies.jwt
    // use jwt verify to decode the token

    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "No Authorize access: No token provided" });
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodeToken) return res.status(401).json({ message: "No Authorize access: Invalid token" });

    // get user data from mongoDB excluding password
    const user = await User.findById(decodeToken.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found!" });
    // now that we have the user data, add custom property 'user' to req so we can use it
    req.authencatedData = { user: user };
    console.log('protected route', req.authencatedData);

    // other function will run after this
    // router.put('/profileUpdate', protectRoute, profileUpdate);
    // profileUpdate will run after protectRoute
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware: ", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
