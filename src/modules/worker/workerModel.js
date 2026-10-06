import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema(
  {
    // projectId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ConstructionProject",
    //   required: [true, "Project ID is required"],
    //   index: true,
    // },
    name: {
      type: String,
      required: [true, "Worker name is required"],
      trim: true,
    },

    contact: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
      enum: [
        "carpenter",
        "plumber",
        "electrician",
        "mason",
        "painter",
        "welder",
        "laborer",
        "other",
      ],
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Worker", WorkerSchema);
