import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Visitor ||
  mongoose.model("Visitor", VisitorSchema);