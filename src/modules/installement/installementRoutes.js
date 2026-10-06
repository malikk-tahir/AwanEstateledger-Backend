import express from "express";
const router = express.Router();
import {
  addInstallment,
  getSocietyInstallments,
} from "./installementControllers.js";
import { isAuthenticatedUser } from "../../middleware/auth.js";

router
  .route("/:societyId")
  .post(isAuthenticatedUser, addInstallment)
  .get(isAuthenticatedUser, getSocietyInstallments);

export default router;
