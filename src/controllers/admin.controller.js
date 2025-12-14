const User = require("../models/user.model");
const Job = require("../models/job.model");

/* =========================
    🧑‍💼 USER MANAGEMENT
========================= */

// 📋 Get all users (seekers + employers + admins)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

// 🧑‍💻 Get all job seekers only
exports.listSeekers = async (req, res) => {
  try {
    const seekers = await User.find({ role: "SEEKER" }, "-password");
    res.json(seekers);
  } catch (err) {
    console.error("❌ Error fetching seekers:", err);
    res.status(500).json({ msg: "Failed to fetch seekers" });
  }
};

// 🏢 Get all employers only
exports.listEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: "EMPLOYER" }, "-password");
    res.json(employers);
  } catch (err) {
    console.error("❌ Error fetching employers:", err);
    res.status(500).json({ msg: "Failed to fetch employers" });
  }
};

// 🗑️ Delete a user (and their jobs if employer)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role === "EMPLOYER") {
      await Job.deleteMany({ employerId: id });
    }

    await User.findByIdAndDelete(id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ msg: "Failed to delete user" });
  }
};

// ⚙️ Change a user's role
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ["SEEKER", "EMPLOYER", "ADMIN"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    res.json(user);
  } catch (err) {
    console.error("❌ Error updating user role:", err);
    res.status(500).json({ msg: "Failed to update role" });
  }
};

/* =========================
    💼 JOB MANAGEMENT
========================= */

// 📋 Get all jobs with employer details
exports.listJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employerId", "name email company");
    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ msg: "Failed to fetch jobs" });
  }
};

// 🗑️ Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Job not found" });
    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting job:", err);
    res.status(500).json({ msg: "Failed to delete job" });
  }
};
