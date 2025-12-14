// const mongoose = require("mongoose");
// const User = require("../models/user.model"); // Import the User model

// const seedDatabase = async () => {
//   try {
//     const existingUsers = await User.find({
//       email: { $in: ["seeker@test.com", "employer@test.com", "admin@test.com"] },
//     });

//     if (existingUsers.length === 3) {
//       console.log("Default accounts already exist.");
//       return;
//     }

//     const defaultUsers = [
//       { email: "seeker@test.com", password: "12345", role: "seeker" },
//       { email: "employer@test.com", password: "12345", role: "employer" },
//       { email: "admin@test.com", password: "12345", role: "admin" },
//     ];

//     // await User.insertMany(defaultUsers);
//     console.log("Default accounts created successfully.");
//   } catch (error) {
//     console.error("Error seeding database:", error.message);
//   }
// };

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB Connected ✅");

//     await seedDatabase(); // Call the seeding function after connecting to the database
//   } catch (err) {
//     console.error("Mongo DB Error:", err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
