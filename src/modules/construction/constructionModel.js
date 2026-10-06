import mongoose from "mongoose";

const ConstructionProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Construction project name is required"],
      trim: true,
    },
    location: { type: String, required: true, trim: true },

    totalBudget: { type: Number, required: true, min: 0 },
    totalSpent: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["planning", "in_progress", "completed", "on_hold"],
      default: "in_progress",
    },
    startDate: { type: Date, default: Date.now },
    expectedCompletionDate: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ConstructionProjectSchema.virtual("remainingBudget").get(function () {
  return (this.totalBudget || 0) - (this.totalSpent || 0);
});

export default mongoose.model("ConstructionProject", ConstructionProjectSchema);

// contractorName: { type: String, trim: true },
// contractorPhone: { type: String, trim: true },
// estimatedBudget: { type: Number, default: 0 },
