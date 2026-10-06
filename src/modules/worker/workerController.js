import ErrorHandler from "../../utills/ErrorHandler.js";
import HandleAsyncError from "../../middleware/HandleAsyncErr.js";
import Worker from "./workerModel.js";

export const createWorker = HandleAsyncError(async (req, res, next) => {
  const { name, contact, category } = req.body;
  const worker = await Worker.create({
    name,
    contact,
    category,
  });

  res.status(201).json({
    success: true,
    message: "Worker created successfully",
    data: worker,
  });
});

export const getAllWorkers = HandleAsyncError(async (req, res, next) => {
  const workers = await Worker.find();

  res.status(200).json({
    success: true,
    data: workers,
  });
});

export const getWorkerById = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const worker = await Worker.findById(id);
  if (!worker) {
    return next(new ErrorHandler("Worker not found", 404));
  }
  res.status(200).json({
    success: true,
    data: worker,
  });
});

export const updateWorker = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, contact, category } = req.body;

  const worker = await Worker.findByIdAndUpdate(
    id,
    { name, contact, category },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!worker) {
    return next(new ErrorHandler("Worker not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Worker updated successfully",
    data: worker,
  });
});
