const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/job.controller");

const { authMiddleware, requireRole } = require("../middleware/auth");

// Public
router.get("/", getJobs);

// Employer-specific BEFORE :id to avoid route shadowing
router.get("/my/jobs", authMiddleware, requireRole("EMPLOYER"), getMyJobs);

// Job details (by id)
router.get("/:id", getJobById);

// Employer
router.post("/", authMiddleware, requireRole("EMPLOYER"), createJob);
router.put("/:id", authMiddleware, requireRole("EMPLOYER"), updateJob);
router.delete("/:id", authMiddleware, requireRole("EMPLOYER"), deleteJob);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management endpoints
 */

/**
 * @swagger
 * /job:
 *   get:
 *     summary: Get all jobs (public)
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of available jobs
 */

/**
 * @swagger
 * /job:
 *   post:
 *     summary: Create a new job (Employer only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               experienceLevel:
 *                 type: string
 *               jobType:
 *                 type: string
 *               locationType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /job/my/jobs:
 *   get:
 *     summary: Get all jobs posted by the logged-in employer
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobs by employer
 */

/**
 * @swagger
 * /job/{id}:
 *   delete:
 *     summary: Delete a job (Employer or Admin)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */
