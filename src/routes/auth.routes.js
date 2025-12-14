
const express = require("express");
const { register, login, me, updateProfile,getAllCompanies } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// protected
router.get("/me", authMiddleware, me);
router.put("/me", authMiddleware, updateProfile);

router.get("/companies", getAllCompanies);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user profile management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [SEEKER, EMPLOYER, ADMIN]
 *                 example: SEEKER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid data or user already exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [SEEKER, EMPLOYER, ADMIN]
 *     responses:
 *       200:
 *         description: Returns JWT token and user details
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user profile
 */

/**
 * @swagger
 * /auth/me:
 *   put:
 *     summary: Update logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               resumeUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */

/**
 * @swagger
 * /auth/companies:
 *   get:
 *     summary: Get all registered companies (public)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of companies
 */

