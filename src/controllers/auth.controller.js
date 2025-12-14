const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const path = require("path");
const fs = require("fs");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "SEEKER",
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    // ✅ Send user and token in consistent structure
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    // ✅ Send consistent structure
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET PROFILE
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ user }); // ✅ wrap in { user } for frontend consistency
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// exports.updateProfile = async (req, res) => {
//   try {
//     const {
//       name,
//       logo,
//       description,
//       website,
//       email,
//       contactInfo,
//       officeAddress,
//       bio,
//       phone,
//       photoUrl,
//       skills,
//       resumeUrl,
//       expectedSalary,
//       jobAlertsEnabled,
//       jobAlertsPreferences,
//     } = req.body;

//     //  Dynamically build update object (includes both EMPLOYER + SEEKER fields)
//     const updates = {
//       ...(name && { name }),
//       ...(logo && { logo }),
//       ...(description && { description }),
//       ...(website && { website }),
//       ...(email && { email }),
//       ...(contactInfo && { contactInfo }),
//       ...(officeAddress && { officeAddress }),
//       ...(bio && { bio }),

//       // ✅ Seeker-specific fields
//       ...(phone && { phone }),
//       ...(photoUrl && { photoUrl }),
//       ...(skills && { skills }),
//       ...(resumeUrl && { resumeUrl }),
//       ...(expectedSalary !== undefined && { expectedSalary }),
//       ...(jobAlertsEnabled !== undefined && { jobAlertsEnabled }),
//       ...(jobAlertsPreferences && { jobAlertsPreferences }),
//     };

//     const updatedUser = await require("../models/user.model")
//       .findByIdAndUpdate(req.user.id, updates, { new: true })
//       .select("-password");

//     if (!updatedUser)
//       return res.status(404).json({ msg: "User not found" });

//     res.json({ msg: "Profile updated successfully", user: updatedUser });
//   } catch (err) {
//     console.error("Profile update error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


const { isValidGoogleDriveUrl } = require("../utils/validators");

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      logo,
      description,
      website,
      email,
      contactInfo,
      officeAddress,
      bio,
      phone,
      photoUrl,
      skills,
      resumeUrl,
      expectedSalary,
      jobAlertsEnabled,
      jobAlertsPreferences,
    } = req.body;

    // 🔒 Validate resume URL if provided
    if (resumeUrl && !isValidGoogleDriveUrl(resumeUrl)) {
      return res.status(400).json({
        msg: "Invalid resume URL. Please provide a valid Google Drive file link.",
      });
    }

    const updates = {
      ...(name && { name }),
      ...(logo && { logo }),
      ...(description && { description }),
      ...(website && { website }),
      ...(email && { email }),
      ...(contactInfo && { contactInfo }),
      ...(officeAddress && { officeAddress }),
      ...(bio && { bio }),

      ...(phone && { phone }),
      ...(photoUrl && { photoUrl }),
      ...(skills && { skills }),
      ...(resumeUrl && { resumeUrl }),
      ...(expectedSalary !== undefined && { expectedSalary }),
      ...(jobAlertsEnabled !== undefined && { jobAlertsEnabled }),
      ...(jobAlertsPreferences && { jobAlertsPreferences }),
    };

    const updatedUser = await require("../models/user.model")
      .findByIdAndUpdate(req.user.id, updates, { new: true })
      .select("-password");

    res.json({
      msg: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: err.message });
  }
};






// Inside auth.controller.js


exports.getAllCompanies = async (req, res) => {
  try {
    const employers = await User.find({ role: "EMPLOYER" }).select(
      "name logo description website contactInfo officeAddress email"
    );

    res.json(employers);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ error: err.message });
  }
};
