import express from "express";
const router = express.Router();
import {
  createWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
} from "./workerController.js";
import { isAuthenticatedUser } from "../../middleware/auth.js";

router
  .route("/")
  .post(isAuthenticatedUser, createWorker)
  .get(isAuthenticatedUser, getAllWorkers);

router
  .route("/:id")
  .get(isAuthenticatedUser, getWorkerById)
  .put(isAuthenticatedUser, updateWorker);

export default router;
