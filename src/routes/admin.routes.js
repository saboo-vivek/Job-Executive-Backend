const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/auth");
const adminController = require("../controllers/admin.controller");

// All admin routes require ADMIN access
router.use(authMiddleware, requireRole("ADMIN"));

// 👥 User management
router.get("/users", adminController.listUsers);
router.get("/seekers", adminController.listSeekers);
router.get("/companies", adminController.listEmployers);
router.delete("/users/:id", adminController.deleteUser);


// 💼 Job management
router.get("/jobs", adminController.listJobs);
router.delete("/jobs/:id", adminController.deleteJob);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only operations
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */

/**
 * @swagger
 * /admin/jobs:
 *   get:
 *     summary: Get all jobs (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all jobs
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

/**
 * @swagger
 * /admin/jobs/{id}:
 *   delete:
 *     summary: Delete a job (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */


