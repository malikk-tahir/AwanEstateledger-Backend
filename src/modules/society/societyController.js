import ErrorHandler from "../../utills/ErrorHandler.js";
import HandleAsyncError from "../../middleware/HandleAsyncErr.js";
import Society from "./societyModel.js";

export const createSociety = HandleAsyncError(async (req, res, next) => {
  const {
    societyName,
    type,
    registrationNumber,
    fileOrPlotNumber,
    blockOrSector,
    size,
    totalPrice,
    demandPrice,
    profit,
    downPaymentPaid,
    status,
  } = req.body;

  const newSociety = await Society.create({
    societyName,
    type,
    registrationNumber,
    fileOrPlotNumber,
    blockOrSector,
    size,
    totalPrice,
    demandPrice,
    profit,
    downPaymentPaid,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Society created successfully",
    data: newSociety,
  });
});

export const addInstallmentToSociety = HandleAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { installmentNo, amount, paidDate } = req.body;

    const society = await Society.findById(id);

    if (!society) {
      return next(new ErrorHandler("Society not found", 404));
    }

    // Add the new installment to the society's installments array
    society.installments.push({
      installmentNo,
      amount,
      paidDate: paidDate || Date.now(),
    });

    await society.save();

    res.status(200).json({
      success: true,
      message: "Installment added successfully",
      data: society,
    });
  },
);

export const getAllSocieties = HandleAsyncError(async (req, res, next) => {
  const societies = await Society.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "Societies retrieved successfully",
    data: societies,
  });
});

export const getSocietyById = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const society = await Society.findById(id);
  if (!society) {
    return next(new ErrorHandler("Society not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Society retrieved successfully",
    data: society,
  });
});

export const updateSociety = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const {
    societyName,
    type,
    registrationNumber,
    fileOrPlotNumber,
    blockOrSector,
    size,
    totalPrice,
    demandPrice,
    profit,
    downPaymentPaid,
    status,
  } = req.body;

  const updatedSociety = await Society.findByIdAndUpdate(
    id,
    {
      societyName,
      registrationNumber,
      type,
      fileOrPlotNumber,
      blockOrSector,
      size,
      totalPrice,
      demandPrice,
      profit,
      downPaymentPaid,
      status,
    },
    { new: true },
  );

  if (!updatedSociety) {
    return next(new ErrorHandler("Society not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Society updated successfully",
    data: updatedSociety,
  });
});
