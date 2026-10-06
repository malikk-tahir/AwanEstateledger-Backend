import express from "express";
import { isAuthenticatedUser } from "../../middleware/auth.js";
import {
  addTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
  getTransactionSummary,
} from "./personalTransactionControllers.js";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticatedUser, addTransaction)
  .get(isAuthenticatedUser, getTransactions);

router.route("/summary").get(isAuthenticatedUser, getTransactionSummary);

router
  .route("/:id")
  .get(isAuthenticatedUser, getTransactionById)
  .put(isAuthenticatedUser, updateTransaction)
  .delete(isAuthenticatedUser, deleteTransaction);

export default router;
