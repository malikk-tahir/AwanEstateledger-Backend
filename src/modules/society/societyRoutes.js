import express from "express";
const router = express.Router();
import {
  createSociety,
  addInstallmentToSociety,
  getAllSocieties,
  getSocietyById,
  updateSociety,
} from "./societyController.js";

import { isAuthenticatedUser } from "../../middleware/auth.js";

router
  .route("/")
  .post(isAuthenticatedUser, createSociety)
  .get(isAuthenticatedUser, getAllSocieties);

router
  .route("/:id")
  .get(isAuthenticatedUser, getSocietyById)
  .put(isAuthenticatedUser, updateSociety);

export default router;
