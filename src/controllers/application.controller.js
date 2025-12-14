const Application = require("../models/application.model");
const Job = require("../models/job.model");
const User = require("../models/user.model"); // ✅ Use User model instead of JobSeeker

exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const seekerId = req.user.id;

    console.log("🎯 Applying to job:", jobId, "by seeker:", seekerId);

    // ✅ Check job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // ✅ Prevent employer from applying to own job
    if (job.employerId.toString() === seekerId)
      return res.status(400).json({ msg: "Cannot apply to own job" });

    // ✅ Check duplicate application
    const exists = await Application.findOne({ jobId, seekerId });
    if (exists) return res.status(400).json({ msg: "Already applied" });

    // ✅ Create new application
    const app = await Application.create({
      jobId,
      seekerId,
      status: "APPLIED",
    });

    // ✅ Add jobId to seeker's appliedJobs array
    await User.findByIdAndUpdate(
      seekerId,
      { $addToSet: { appliedJobs: jobId } }, // no duplicates
      { new: true }
    );
    // ✅ Update job’s applicants array
    await Job.findByIdAndUpdate(
      jobId,
      { $addToSet: { applicants: req.user.id } },
      { new: true }
    );

    console.log("✅ Application created successfully:", app._id);

    res.status(201).json({
      msg: "Application submitted successfully",
      application: app,
    });
  } catch (err) {
    console.error("❌ Error in applyToJob:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ seekerId: req.user.id })
      .populate({
        path: "jobId",
        populate: { path: "employerId", select: "name company" }
      });

    // ✅ Filter out any apps without valid job
    const validApps = apps.filter(a => a.jobId !== null);

    res.json(validApps);
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ msg: "Job not found" });
    if (job.employerId.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not your job" });

    const apps = await Application.find({ jobId: req.params.id })
      .populate("seekerId", "name email");

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["APPLIED", "SHORTLISTED", "HIRED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const application = await Application.findById(id).populate("jobId");
    if (!application) return res.status(404).json({ msg: "Application not found" });

    // ✅ Ensure only the employer who posted the job can update
    if (application.jobId.employerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    // ✅ Sync job arrays (optional but clean)
    const job = await Job.findById(application.jobId._id);
    if (job) {
      // Remove from all arrays first
      job.applicants = job.applicants.filter(id => id.toString() !== application.seekerId.toString());
      job.shortlisted = job.shortlisted.filter(id => id.toString() !== application.seekerId.toString());
      job.rejected = job.rejected.filter(id => id.toString() !== application.seekerId.toString());

      // Add to the correct one
      if (status === "APPLIED") job.applicants.push(application.seekerId);
      else if (status === "SHORTLISTED") job.shortlisted.push(application.seekerId);
      else if (status === "REJECTED") job.rejected.push(application.seekerId);

      await job.save();
    }

    res.json({ msg: "Status updated successfully", application });
  } catch (err) {
    console.error("❌ Error updating application status:", err);
    res.status(500).json({ error: err.message });
  }
};

