import ErrorHandler from "../../utills/ErrorHandler.js";
import HandleAsyncError from "../../middleware/HandleAsyncErr.js";
import ConstructionLedger from "./constructionLedgerModel.js";
import ConstructionProject from "../construction/constructionModel.js";
import apiFeatures from "../../utills/apiFeatures.js";
import Worker from "../worker/workerModel.js";
import mongoose from "mongoose";

export const createLedgerEntry = HandleAsyncError(async (req, res, next) => {
  const { projectId } = req.params;
  const {
    workerId,
    contractAmount,
    labourCost,
    materialCost,
    amountPaid,
    description,
    date,
  } = req.body;

  const [project, worker] = await Promise.all([
    ConstructionProject.findById(projectId),
    Worker.findById(workerId),
  ]);

  if (!project) {
    return next(new ErrorHandler("Construction project not found", 404));
  }

  if (!worker) {
    return next(new ErrorHandler("Worker profile not found", 404));
  }

  const ledgerEntry = await ConstructionLedger.create({
    projectId,
    workerId,
    contractAmount: contractAmount || 0,
    labourCost,
    materialCost,
    amountPaid: amountPaid || 0,
    description,
    date: date || Date.now(),
  });

  if (amountPaid && amountPaid > 0) {
    await ConstructionProject.findByIdAndUpdate(projectId, {
      $inc: { totalSpent: amountPaid },
    });
  }

  const populatedEntry = await ledgerEntry.populate(
    "workerId",
    "name category contact",
  );

  res.status(201).json({
    success: true,
    message: "Ledger entry created successfully",
    data: populatedEntry,
  });
});

export const getProjectLedgers = HandleAsyncError(async (req, res, next) => {
  const { projectId } = req.params;
  const resultsPerPage = 10;

  const porject = await ConstructionProject.findById(projectId);
  if (!porject) {
    return next(new ErrorHandler("Construction project not found", 404));
  }

  const baseQuery = ConstructionLedger.find({ projectId });

  const countApiFeatures = new apiFeatures(
    ConstructionLedger.find({ projectId }),
    req.query,
  ).filter();

  const totalCount = await countApiFeatures.query.countDocuments();

  const apiFeature = new apiFeatures(baseQuery, req.query)
    .filter()
    .pagination(resultsPerPage);

  const ledgers = await apiFeature.query.populate(
    "workerId",
    "name category contact",
  );

  res.status(200).json({
    success: true,
    totalCount,
    totalPages: Math.ceil(totalCount / resultsPerPage),
    currentPage: Number(req.query.page) || 1,
    data: ledgers,
  });
});

export const getLedgerEntryById = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const ledgerEntry = await ConstructionLedger.findById(id).populate(
    "workerId",
    "name category contact",
  );

  if (!ledgerEntry) {
    return next(new ErrorHandler("Ledger entry not found", 404));
  }

  res.status(200).json({
    success: true,
    data: ledgerEntry,
  });
});

// Calculate total costs, payments, and remaining balance for a specific worker
export const getWorkerSummary = HandleAsyncError(async (req, res, next) => {
  const { projectId, workerId } = req.params;

  const [project, worker] = await Promise.all([
    ConstructionProject.findById(projectId),
    Worker.findById(workerId),
  ]);

  if (!project) {
    return next(new ErrorHandler("Construction project not found", 404));
  }

  if (!worker) {
    return next(new ErrorHandler("Worker profile not found", 404));
  }

  const result = await ConstructionLedger.aggregate([
    {
      $match: {
        projectId: new mongoose.Types.ObjectId(projectId),
        workerId: new mongoose.Types.ObjectId(workerId),
      },
    },
    {
      $group: {
        _id: "$workerId",
        contractAmount: { $max: "$contractAmount" },
        totalLabour: { $sum: "$labourCost" },
        totalMaterial: { $sum: "$materialCost" },
        totalPaid: { $sum: "$amountPaid" },
      },
    },
    {
      $project: {
        _id: 1,
        contractAmount: { $ifNull: ["$contractAmount", 0] },
        totalLabour: 1,
        totalMaterial: 1,
        totalPaid: 1,
        totalCost: { $add: ["$totalLabour", "$totalMaterial"] },
        remainingBalance: {
          $subtract: [
            { $add: ["$totalLabour", "$totalMaterial"] },
            "$totalPaid",
          ],
        },
      },
    },
  ]);

  // console.log(result);

  const summary = result[0] || {
    contractAmount: 0,
    totalLabour: 0,
    totalMaterial: 0,
    totalPaid: 0,
    totalCost: 0,
    remainingBalance: 0,
  };

  // console.log(summary);

  res.status(200).json({
    success: true,
    data: {
      worker: {
        _id: worker._id,
        name: worker.name,
        category: worker.category,
      },
      ...summary,
    },
  });
});

// Get overall financial overview of an entire construction project
// GET /api/ledgers/project/:projectId/summary
export const getProjectSummary = HandleAsyncError(async (req, res, next) => {
  const { projectId } = req.params;

  const result = await ConstructionLedger.aggregate([
    { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: "$projectId",
        totalLabourCost: { $sum: "$labourCost" },
        totalMaterialCost: { $sum: "$materialCost" },
        totalAmountPaid: { $sum: "$amountPaid" },
        totalTransactions: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        totalLabourCost: 1,
        totalMaterialCost: 1,
        totalProjectCost: { $add: ["$totalLabourCost", "$totalMaterialCost"] },
        totalAmountPaid: 1,
        totalOutstandingDebt: {
          $subtract: [
            { $add: ["$totalLabourCost", "$totalMaterialCost"] },
            "$totalAmountPaid",
          ],
        },
        totalTransactions: 1,
      },
    },
  ]);

  // console.log(result);

  const summary = result[0] || {
    _id: projectId,
    totalLabourCost: 0,
    totalMaterialCost: 0,
    totalProjectCost: 0,
    totalAmountPaid: 0,
    totalOutstandingDebt: 0,
    totalTransactions: 0,
  };

  // console.log(summary);

  res.status(200).json({
    success: true,
    data: summary,
  });
});

export const getProjectLedgerWorkers = HandleAsyncError(
  async (req, res, next) => {
    const { projectId } = req.params;

    const workers = await ConstructionLedger.aggregate([
      // 1. Filter entries by project ID
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
        },
      },
      // 2. Group by workerId to eliminate duplicate entries
      {
        $group: {
          _id: "$workerId",
        },
      },
      // 3. Populate (lookup) the worker profile from the workers collection
      {
        $lookup: {
          from: "workers", // Name of the workers collection in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "workerDetails",
        },
      },
      // 4. Flatten the workerDetails array
      {
        $unwind: "$workerDetails",
      },
      // 5. Select (project) only the fields you need
      {
        $project: {
          _id: "$workerDetails._id",
          name: "$workerDetails.name",
          category: "$workerDetails.category",
          phone: "$workerDetails.phone",
        },
      },
      // 6. Sort alphabetically by name
      {
        $sort: { name: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: workers,
    });
  },
);
