import mongoose from "mongoose";
import ErrorHandler from "../../utills/ErrorHandler.js";
import HandleAsyncError from "../../middleware/HandleAsyncErr.js";
import ApiFeatures from "../../utills/apiFeatures.js";
import PersonalCategory from "../personalCategory/personalCategoryModel.js";
import PersonalTransaction from "./personalTransactionModel.js";
import { getDateFilter } from "../../utills/dateFilter.js";

export const addTransaction = HandleAsyncError(async (req, res, next) => {
  const { type, amount, category, date, description } = req.body;

  const existingCategory = await PersonalCategory.findOne({
    _id: category,
    $or: [{ isDefault: true }, { user: req.user._id }],
  });
  if (!existingCategory) {
    return next(new ErrorHandler("Personal category not found", 404));
  }

  const transaction = await PersonalTransaction.create({
    user: req.user._id,
    type,
    amount,
    category,
    date: date || new Date(),
    description,
  });

  await transaction.populate("category", "name");

  res.status(201).json({
    success: true,
    message: "Transaction added successfully",
    data: transaction,
  });
});

export const getTransactions = HandleAsyncError(async (req, res) => {
  const resultsPerPage = 10;
  const dateFilter = getDateFilter(req.query);

  const queryCopy = { ...req.query };
  delete queryCopy.startDate;
  delete queryCopy.endDate;

  const baseFilter = { user: req.user._id };
  if (Object.keys(dateFilter).length > 0) {
    baseFilter.date = dateFilter;
  }

  const countFeatures = new ApiFeatures(
    PersonalTransaction.find(baseFilter),
    queryCopy,
  ).filter();

  const totalCount = await countFeatures.query.countDocuments();

  const apiFeatures = new ApiFeatures(
    PersonalTransaction.find(baseFilter),
    queryCopy,
  )
    .filter()
    .pagination(resultsPerPage);

  const transactions = await apiFeatures.query
    .sort({ date: -1, createdAt: -1 })
    .populate("category", "name");

  res.status(200).json({
    success: true,
    totalRecords: totalCount,
    resultsPerPage: resultsPerPage,
    currentPage: Number(req.query.page) || 1,
    totalPages: Math.ceil(totalCount / resultsPerPage) || 1,
    data: transactions,
  });
});

export const getTransactionSummary = HandleAsyncError(async (req, res) => {
  const totals = await PersonalTransaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $group: {
        _id: "$type",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const totalIncoming =
    totals.find((t) => t._id === "incoming")?.totalAmount || 0;
  const totalOutgoing =
    totals.find((t) => t._id === "outgoing")?.totalAmount || 0;
  const netBalance = totalIncoming - totalOutgoing;

  res.status(200).json({
    success: true,
    summary: {
      totalIncoming,
      totalOutgoing,
      netBalance,
    },
  });
});

// 3. GET TRANSACTION BY ID
export const getTransactionById = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid transaction ID", 400));
  }

  const transaction = await PersonalTransaction.findOne({
    _id: id,
    user: req.user._id,
  }).populate("category", "name");
  if (!transaction) {
    return next(new ErrorHandler("Transaction not found", 404));
  }

  res.status(200).json({ success: true, data: transaction });
});

// 4. UPDATE TRANSACTION
export const updateTransaction = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { type, amount, category, date, description } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid transaction ID", 400));
  }
  if (
    category &&
    !(await PersonalCategory.findOne({
      _id: category,
      $or: [{ isDefault: true }, { user: req.user._id }],
    }))
  ) {
    return next(new ErrorHandler("Personal category not found", 404));
  }

  const transaction = await PersonalTransaction.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { type, amount, category, date, description },
    { new: true, runValidators: true },
  ).populate("category", "name");

  if (!transaction) {
    return next(new ErrorHandler("Transaction not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Transaction updated successfully",
    data: transaction,
  });
});

// 5. DELETE TRANSACTION
export const deleteTransaction = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid transaction ID", 400));
  }

  const transaction = await PersonalTransaction.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });
  if (!transaction) {
    return next(new ErrorHandler("Transaction not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Transaction deleted successfully",
  });
});
