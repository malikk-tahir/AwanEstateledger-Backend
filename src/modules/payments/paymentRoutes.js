import express from "express";
const router = express.Router();
import { addPayment, getPropertyPayments } from "./paymentController.js";
import { isAuthenticatedUser } from "../../middleware/auth.js";

router
  .route("/:propertyId")
  .post(isAuthenticatedUser, addPayment)
  .get(isAuthenticatedUser, getPropertyPayments);

export default router;
