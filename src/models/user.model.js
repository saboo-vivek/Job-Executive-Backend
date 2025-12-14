const mongoose = require("mongoose");

const jobAlertsPreferencesSchema = new mongoose.Schema({
  keywords: [String],
  jobTypes: [String],
  locationTypes: [String],
  minSalary: Number,
});

const reviewSchema = new mongoose.Schema({
  authorId: String,
  reviewerName: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    // Common fields
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYER", "SEEKER"],
      default: "SEEKER",
    },

    // ✅ EMPLOYER-specific fields
    logo: { type: String, default: "https://via.placeholder.com/150" },
    description: { type: String, default: "" },
    website: { type: String, default: "" },
    contactInfo: { type: String, default: "" },
    officeAddress: { type: String, default: "" },
    reviews: [reviewSchema],
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // ✅ SEEKER-specific fields
    phone: { type: String, default: "" },
    photoUrl: { type: String, default: "https://i.pravatar.cc/150" },
    skills: [String],
    resumeUrl: { type: String, default: "" },
    expectedSalary: { type: Number, default: 0 },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    jobAlertsEnabled: { type: Boolean, default: false },
    jobAlertsPreferences: jobAlertsPreferencesSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
