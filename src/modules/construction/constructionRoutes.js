import express from "express";
const router = express.Router();
import {
  createConstructionProject,
  getAllConstructionProjects,
  getConstructionProjectById,
  updateConstructionProject,
} from "./constructionController.js";

import { isAuthenticatedUser } from "../../middleware/auth.js";

router
  .route("/")
  .post(isAuthenticatedUser, createConstructionProject)
  .get(isAuthenticatedUser, getAllConstructionProjects);
router
  .route("/:id")
  .get(isAuthenticatedUser, getConstructionProjectById)
  .put(isAuthenticatedUser, updateConstructionProject);

export default router;
