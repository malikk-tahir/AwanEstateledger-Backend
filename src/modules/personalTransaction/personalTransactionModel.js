import mongoose from "mongoose";

const personalTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    type: {
      type: String,
      enum: ["incoming", "outgoing"],
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than zero"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalCategory",
      required: [true, "Category is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);
personalTransactionSchema.index({ user: 1, date: -1 });
export default mongoose.model("PersonalTransaction", personalTransactionSchema);
