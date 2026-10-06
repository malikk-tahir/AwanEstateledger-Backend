import ErrorHandler from "../../utills/ErrorHandler.js";
import HandleAsyncError from "../../middleware/HandleAsyncErr.js";
import ConstructionProject from "./constructionModel.js";

export const createConstructionProject = HandleAsyncError(
  async (req, res, next) => {
    const {
      name,
      location,
      totalBudget,
      status,
      startDate,
      expectedCompletionDate,
    } = req.body;

    const newProject = await ConstructionProject.create({
      name,
      location,
      totalBudget,
      status,
      startDate,
      expectedCompletionDate,
    });

    res.status(201).json({
      success: true,
      message: "Construction project created successfully",
      data: newProject,
    });
  },
);

export const getAllConstructionProjects = HandleAsyncError(
  async (req, res, next) => {
    const projects = await ConstructionProject.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Construction projects retrieved successfully",
      data: projects,
    });
  },
);

export const getConstructionProjectById = HandleAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const project = await ConstructionProject.findById(id);
    if (!project) {
      return next(new ErrorHandler("Construction project not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Construction project retrieved successfully",
      data: project,
    });
  },
);

export const updateConstructionProject = HandleAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const {
      name,
      location,
      totalBudget,
      status,
      startDate,
      expectedCompletionDate,
    } = req.body;
    const project = await ConstructionProject.findByIdAndUpdate(
      id,
      {
        name,
        location,
        totalBudget,
        status,
        startDate,
        expectedCompletionDate,
      },
      { new: true, runValidators: true },
    );
    if (!project) {
      return next(new ErrorHandler("Construction project not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Construction project updated successfully",
      data: project,
    });
  },
);
