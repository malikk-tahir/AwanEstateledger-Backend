import express from "express";
const router = express.Router();

import {
  createLedgerEntry,
  getProjectLedgers,
  getLedgerEntryById,
  getWorkerSummary,
  getProjectSummary,
  getProjectLedgerWorkers,
} from "./constructionLedgerController.js";
import { isAuthenticatedUser } from "../../middleware/auth.js";

router
  .route("/project/:projectId")
  .post(isAuthenticatedUser, createLedgerEntry)
  .get(isAuthenticatedUser, getProjectLedgers);
router.route("/ledger/:id").get(isAuthenticatedUser, getLedgerEntryById);
router
  .route("/worker-summary/project/:projectId/worker/:workerId")
  .get(isAuthenticatedUser, getWorkerSummary);
router
  .route("/project-summary/:projectId")
  .get(isAuthenticatedUser, getProjectSummary);

router.get(
  "/projects/:projectId/workers",
  isAuthenticatedUser,
  getProjectLedgerWorkers,
);

export default router;
