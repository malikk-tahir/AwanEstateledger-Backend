import HandleAsyncError from "../../middleware/HandleAsyncErr.js";
import PersonalCategory from "./personalCategoryModel.js";

export const addCategory = HandleAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const normalizedName = name.trim().toLowerCase();

  const existingCategory = await PersonalCategory.findOne({
    name: normalizedName,
    $or: [{ isDefault: true }, { user: req.user._id }],
  });

  if (existingCategory) {
    return next(new ErrorHandler("Category already exists", 400));
  }

  const category = await PersonalCategory.create({
    name: normalizedName,
    user: req.user._id,
    isDefault: false,
  });

  res.status(201).json({
    success: true,
    message: "Category added successfully",
    data: category,
  });
});

export const getCategories = HandleAsyncError(async (req, res) => {
  const categories = await PersonalCategory.find({
    $or: [{ user: req.user._id }, { isDefault: true }],
  }).sort({
    name: 1,
  });

  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
  });
});
