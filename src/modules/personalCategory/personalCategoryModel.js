import mongoose from "mongoose";

const personalCategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

personalCategorySchema.index({ user: 1, isDefault: 1, name: 1 });
export default mongoose.model("PersonalCategory", personalCategorySchema);
