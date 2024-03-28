import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

//protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  //Read the JWT from the cookie

  token = req.cookies.jwt;

  if (token) {
    try {
      //Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get the user from the database
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("No autorizado, token fallido");
    }
  } else {
    res.status(401);
    throw new Error("No autorizado, no hay token");
  }
});

//admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("No autorizado como administrador");
  }
};

export { protect, admin };
