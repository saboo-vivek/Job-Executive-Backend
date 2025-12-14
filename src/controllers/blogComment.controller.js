const BlogPost = require("../models/blog.model");

/* -------------------- ADD COMMENT -------------------- */
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.userDoc;

    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({
      authorId: user._id,
      authorName: user.name,
      authorPhotoUrl: user.photoUrl,
      content
    });

    await blog.save();
    res.status(201).json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* -------------------- UPDATE COMMENT -------------------- */
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { id, commentId } = req.params;

    const blog = await BlogPost.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.authorId.toString() !== req.userDoc._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    comment.content = content;
    comment.isEdited = true;
    await blog.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* -------------------- DELETE COMMENT -------------------- */
exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const blog = await BlogPost.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.authorId.toString() !== req.userDoc._id.toString() &&
      req.userDoc.role !== "ADMIN"
    )
      return res.status(403).json({ message: "Unauthorized" });

    comment.deleteOne();
    await blog.save();

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
