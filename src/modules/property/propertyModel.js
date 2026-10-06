import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      enum: ["plot", "house", "shop", "plaza", "other"],
      default: "plot",
    },
    location: { type: String, required: true, trim: true },
    size: { type: String, trim: true }, // e.g., "5 Marla"

    // Ownership & Details
    isOwned: { type: Boolean, default: false },
    ownerName: {
      type: String,
      trim: true,
      required: [
        function () {
          return !this.isOwned;
        },
        "Owner name is required for third-party properties",
      ],
    },
    ownerContact: {
      type: String,
      trim: true,
      required: [
        function () {
          return !this.isOwned;
        },
        "Owner contact is required for third-party properties",
      ],
    },

    // Pricing
    purchasePrice: { type: Number, default: 0 },
    demandPrice: { type: Number, required: true },
    finalSellingPrice: { type: Number, default: 0 },

    taxPercentage: {
      type: Number,
      default: 0,
      min: [0, "Tax percentage cannot be negative"],
      max: [100, "Tax percentage cannot exceed 100%"],
    },
    status: {
      type: String,
      enum: ["available", "under_offer", "sold", "transferred", "resale"],
      default: "available",
    },
  },
  { timestamps: true },
);

PropertySchema.virtual("taxAmount").get(function () {
  const basePrice =
    this.finalSellingPrice > 0 ? this.finalSellingPrice : this.demandPrice;
  return (basePrice * (this.taxPercentage || 0)) / 100;
});

export default mongoose.model("Property", PropertySchema);
