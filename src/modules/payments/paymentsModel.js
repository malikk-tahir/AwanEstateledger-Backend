import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property reference is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    paymentType: {
      type: String,
      required: [true, "Payment type is required"],
      enum: {
        values: ["purchase_payment", "sale_receipt", "commission"],
        message: "{VALUE} is not a valid payment type",
      },
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", PaymentSchema);
