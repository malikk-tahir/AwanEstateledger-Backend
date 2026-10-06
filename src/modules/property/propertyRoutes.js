import express from "express";
const router = express.Router();
import {
  createProperty,
  addPaymentToProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
} from "./propertyController.js";

import { isAuthenticatedUser } from "../../middleware/auth.js";

router
  .route("/")
  .post(isAuthenticatedUser, createProperty)
  .get(isAuthenticatedUser, getAllProperties);

router
  .route("/:id")
  .get(isAuthenticatedUser, getPropertyById)
  .put(isAuthenticatedUser, updateProperty);

router.route("/payments/:id").post(isAuthenticatedUser, addPaymentToProperty);

export default router;
