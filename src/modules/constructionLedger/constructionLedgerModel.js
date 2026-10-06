import mongoose from "mongoose";

const ConstructionLedgerSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConstructionProject",
      required: [true, "Project ID is required"],
      index: true,
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: [true, "Worker reference is required"],
      index: true,
    },

    contractAmount: {
      type: Number,
      default: 0,
      min: [0, "Contract amount cannot be negative"],
    },

    labourCost: {
      type: Number,
      default: 0,
      min: [0, "Labour cost cannot be negative"],
    },

    materialCost: {
      type: Number,
      default: 0,
      min: [0, "Material cost cannot be negative"],
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ConstructionLedgerSchema.virtual("totalCost").get(function () {
  return (this.labourCost || 0) + (this.materialCost || 0);
});

ConstructionLedgerSchema.virtual("balanceOwed").get(function () {
  const balance = this.totalCost - (this.amountPaid || 0);
  return balance < 0 ? 0 : balance;
});

export default mongoose.model("ConstructionLedger", ConstructionLedgerSchema);
