import ErrorHandler from "../../utills/ErrorHandler.js";
import HandleAsyncError from "../../middleware/HandleAsyncErr.js";
import Property from "../property/propertyModel.js";
import Payment from "./paymentsModel.js";
import apiFeatures from "../../utills/apiFeatures.js";

export const addPayment = HandleAsyncError(async (req, res, next) => {
  const { propertyId } = req.params;
  const { amount, paymentType, note, date } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    return next(new ErrorHandler("Property not found", 404));
  }

  const newPayment = await Payment.create({
    propertyId,
    amount,
    paymentType,
    note,
    date: date || Date.now(),
  });

  // 3. Optional: Sync property status based on transaction type
  //   if (paymentType === "sale_receipt" && property.status !== "sold") {
  //     property.status = "sold";
  //     await property.save();
  //   }

  res.status(201).json({
    success: true,
    message: "Payment recorded successfully",
    data: newPayment,
  });
});

export const getPropertyPayments = HandleAsyncError(async (req, res, next) => {
  const { propertyId } = req.params;
  const resultsPerPage = 10;

  const property = await Property.findById(propertyId);
  if (!property) {
    return next(new ErrorHandler("Property not found", 404));
  }

  const baseQuery = Payment.find({ propertyId }).sort({ createdAt: -1 });

  const totalCount = await Payment.countDocuments({ propertyId });

  const apiFeature = new apiFeatures(baseQuery, req.query).pagination(
    resultsPerPage,
  );

  const payments = await apiFeature.query;

  res.status(200).json({
    success: true,
    totalCount,
    totalPages: Math.ceil(totalCount / resultsPerPage),
    currentPage: Number(req.query.page) || 1,
    data: payments,
  });
});
