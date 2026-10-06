import ErrorHandler from "../../utills/ErrorHandler.js";
import HandleAsyncError from "../../middleware/HandleAsyncErr.js";
import Society from "../society/societyModel.js";
import Installment from "./installementModel.js";
import apiFeatures from "../../utills/apiFeatures.js";

export const addInstallment = HandleAsyncError(async (req, res, next) => {
  const { societyId } = req.params;
  const { amount, paidAmount, dueDate, paidDate, status, note } = req.body;

  const society = await Society.findById(societyId);
  if (!society) {
    return next(new ErrorHandler("Society not found", 404));
  }

  const newInstallment = await Installment.create({
    societyId,
    amount,
    paidAmount: paidAmount || 0,
    dueDate,
    paidDate: paidDate || null,
    status: status || "pending",
    note: note || "",
  });

  res.status(201).json({
    success: true,
    message: "Installment created successfully",
    data: newInstallment,
  });
});

export const getSocietyInstallments = HandleAsyncError(
  async (req, res, next) => {
    const { societyId } = req.params;
    const resultsPerPage = 10;

    const society = await Society.findById(societyId);
    if (!society) {
      return next(new ErrorHandler("Society not found", 404));
    }

    const baseQuery = Installment.find({ societyId }).sort({ dueDate: 1 });

    const totalCount = await Installment.countDocuments({ societyId });

    const apiFeature = new apiFeatures(baseQuery, req.query).pagination(
      resultsPerPage,
    );

    const installments = await apiFeature.query;

    res.status(200).json({
      success: true,
      totalCount,
      totalPages: Math.ceil(totalCount / resultsPerPage),
      currentPage: Number(req.query.page) || 1,
      data: installments,
    });
  },
);
