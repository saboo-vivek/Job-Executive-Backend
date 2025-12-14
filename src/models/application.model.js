const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["APPLIED", "SHORTLISTED", "HIRED", "REJECTED"],
      default: "APPLIED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Application || mongoose.model("Application", applicationSchema);
