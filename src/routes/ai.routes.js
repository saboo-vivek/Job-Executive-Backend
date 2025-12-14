const express = require("express");
const router = express.Router();

const { boostResume } = require("../controllers/ai.controller");
const { authMiddleware,aiRateLimiter  }  = require("../middleware/auth");

router.post("/boost", authMiddleware,aiRateLimiter, boostResume);

module.exports = router;
