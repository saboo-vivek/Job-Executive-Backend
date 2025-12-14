const BlogPost = require("../models/blog.model");

/* -------------------- CREATE BLOG -------------------- */
exports.createBlog = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const user = req.userDoc;

    const blog = await BlogPost.create({
      title,
      content,
      status: status || "published",
      authorId: user._id,
      authorName: user.name,
      authorRole: user.role,
      authorPhotoUrl: user.photoUrl
    });

    res.status(201).json(blog); // return blog directly
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- GET ALL BLOGS -------------------- */
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find({ status: "published" })
      .sort({ createdAt: -1 });

    res.json(blogs); // ✅ array
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* -------------------- GET SINGLE BLOG -------------------- */
exports.getBlogById = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);

    if (!blog)
      return res.status(404).json({ success: false, message: "Blog not found" });

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------- UPDATE BLOG -------------------- */
exports.updateBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.authorId.toString() !== req.userDoc._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(blog, req.body);
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- DELETE BLOG -------------------- */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (
      blog.authorId.toString() !== req.userDoc._id.toString() &&
      req.userDoc.role !== "ADMIN"
    )
      return res.status(403).json({ message: "Unauthorized" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
