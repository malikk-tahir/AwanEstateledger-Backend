import mongoose from "mongoose";

const installmentSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: [true, "Society ID is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Installment total amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    paidDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "paid", "partially_paid", "overdue", "waived"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Installment = mongoose.model("Installment", installmentSchema);

export default Installment;
