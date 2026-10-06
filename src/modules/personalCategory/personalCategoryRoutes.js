import express from "express";
import { isAuthenticatedUser } from "../../middleware/auth.js";
import { addCategory, getCategories } from "./personalCategoryControllers.js";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticatedUser, addCategory)
  .get(isAuthenticatedUser, getCategories);

export default router;
