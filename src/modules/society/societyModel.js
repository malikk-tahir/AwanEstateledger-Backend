import mongoose from "mongoose";

const SocietyProjectSchema = new mongoose.Schema(
  {
    societyName: { type: String, required: true, trim: true },
    type: { type: String, enum: ["file", "plot"], default: "file" },
    registrationNumber: { type: String, trim: true },
    fileOrPlotNumber: { type: String, trim: true },
    blockOrSector: { type: String, trim: true },
    size: { type: String, trim: true },

    totalPrice: { type: Number, required: true },
    demandPrice: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    downPaymentPaid: { type: Number, default: 0 },

    status: {
      type: String,
      enum: [
        "active_installment",
        "fully_paid",
        "sold",
        "cancelled",
        "only_down_payment",
        "open",
      ],
      default: "active_installment",
    },
  },
  { timestamps: true },
);

export default mongoose.model("SocietyProject", SocietyProjectSchema);
