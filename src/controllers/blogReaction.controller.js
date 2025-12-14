const BlogPost = require("../models/blog.model");

/* -------------------- ADD / UPDATE REACTION -------------------- */
exports.reactToBlog = async (req, res) => {
  try {
    const { type } = req.body;
    const blog = await BlogPost.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const existing = blog.reactions.find(
      r => r.userId.toString() === req.userDoc._id.toString()
    );

    if (existing) {
      existing.type = type;
    } else {
      blog.reactions.push({
        userId: req.userDoc._id,
        type
      });
    }

    await blog.save();
    res.json(blog.reactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- REMOVE REACTION -------------------- */
exports.removeReaction = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ success: false, message: "Blog not found" });

    blog.reactions = blog.reactions.filter(
      r => r.userId.toString() !== req.user._id.toString()
    );

    await blog.save();
    res.json({ success: true, reactions: blog.reactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
