const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/auth");
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus
} = require("../controllers/application.controller");

// Seeker applies to job
router.post("/:id/apply", authMiddleware, requireRole("SEEKER"), applyToJob);

// Seeker views own applications
router.get("/me", authMiddleware, requireRole("SEEKER"), getMyApplications);

// Employer views applications for a job
router.get("/:id/applications", authMiddleware, requireRole("EMPLOYER"), getApplicationsForJob);

// Employer updates application status (app id in params)
router.put("/status/:id", authMiddleware, requireRole("EMPLOYER"), updateApplicationStatus);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job application management
 */

/**
 * @swagger
 * /applications/{jobId}/apply:
 *   post:
 *     summary: Apply to a job (Seeker only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID of job to apply for
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Already applied or invalid job
 */

/**
 * @swagger
 * /applications/me:
 *   get:
 *     summary: Get all applications of the logged-in seeker
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications with job details
 */

/**
 * @swagger
 * /applications/{jobId}/applications:
 *   get:
 *     summary: Get applicants for a specific job (Employer only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of applicants with seeker info
 */

/**
 * @swagger
 * /applications/status/{applicationId}:
 *   put:
 *     summary: Update applicant status (Employer only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPLIED, SHORTLISTED, REJECTED]
 *     responses:
 *       200:
 *         description: Application status updated
 */
