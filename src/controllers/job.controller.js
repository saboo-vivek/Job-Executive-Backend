const Job = require("../models/job.model");

// 🟢 Create a new job (Employer only)
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      experienceLevel,
      salaryMin,
      salaryMax,
      jobType,
      locationType,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and description are required" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      experienceLevel,
      salaryMin,
      salaryMax,
      jobType,
      locationType,
      employerId: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("❌ Job creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get all jobs (Public)
exports.getJobs = async (req, res) => {
  try {
    const { q, location, jobType, locationType, experienceLevel, minSalary, maxSalary } = req.query;

    const filter = {};

    if (q) filter.title = { $regex: q, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (locationType) filter.locationType = locationType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    // Salary range filter
    if (minSalary || maxSalary) {
      filter.$or = [
        {
          salaryMin: { $gte: Number(minSalary) || 0 },
          salaryMax: { $lte: Number(maxSalary) || 9999999 },
        },
      ];
    }

    const jobs = await Job.find(filter)
      .populate("employerId", "name company bio email")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("employerId", "name company bio email");
    if (!job) return res.status(404).json({ msg: "Job not found" });

    res.json(job);
  } catch (err) {
    console.error("❌ Error fetching job by ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get jobs posted by the logged-in employer
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching employer jobs:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Update a job (Employer only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      employerId: req.user.id,
    });

    if (!job) return res.status(404).json({ msg: "Job not found or not authorized" });

    Object.assign(job, req.body);
    await job.save();

    res.json(job);
  } catch (err) {
    console.error("❌ Error updating job:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Delete a job (Employer only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      employerId: req.user.id,
    });

    if (!job) return res.status(404).json({ msg: "Job not found or not authorized" });

    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting job:", err);
    res.status(500).json({ error: err.message });
  }
};
