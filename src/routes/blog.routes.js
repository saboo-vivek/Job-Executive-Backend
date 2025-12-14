const express = require("express");
const router = express.Router();
// const auth = require("../middlewares/auth.middleware");
const { authMiddleware }  = require("../middleware/auth");
const blogController = require("../controllers/blog.controller");
const reactionController = require("../controllers/blogReaction.controller");
const commentController = require("../controllers/blogComment.controller");

/* -------- BLOG -------- */
router.post("/", authMiddleware, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", authMiddleware, blogController.updateBlog);
router.delete("/:id", authMiddleware, blogController.deleteBlog);

/* -------- REACTIONS -------- */
router.post("/:id/react", authMiddleware, reactionController.reactToBlog);
router.delete("/:id/react", authMiddleware, reactionController.removeReaction);

/* -------- COMMENTS -------- */
router.post("/:id/comment", authMiddleware, commentController.addComment);
router.put("/:id/comment/:commentId", authMiddleware, commentController.updateComment);
router.delete("/:id/comment/:commentId", authMiddleware, commentController.deleteComment);

module.exports = router;
