require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/job.routes");
const appRoutes = require("./routes/application.routes");
const adminRoutes = require("./routes/admin.routes");
const blogRoutes= require("./routes/blog.routes");
const aiRoutes = require("./routes/ai.routes");
const seedDefaultUsers = require("./utils/seedUsers");




const setupSwagger = require("./swagger");
const app = express();

connectDB();
seedDefaultUsers(); 

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

setupSwagger(app);

connectDB();

app.use("/auth", authRoutes);
app.use("/job", jobRoutes);
app.use("/applications", appRoutes);
app.use("/admin", adminRoutes);
app.use("/blogs", blogRoutes);
app.use("/ai", aiRoutes);
app.get("/", (req, res) => res.send("Job Executive API running ✅"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

module.exports = app;
