import jwt from "jsonwebtoken";
import User from "../modules/user/userModel.js";
import ErrorHandler from "../utills/ErrorHandler.js";
import HandleAsyncError from "../middleware/HandleAsyncErr.js";

export const isAuthenticatedUser = HandleAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedData.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;
  next();
});
