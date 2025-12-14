const mongoose = require("mongoose");

const { Schema } = mongoose;

/* -------------------- COMMENT SCHEMA -------------------- */
const commentSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Snapshot data (safe to denormalize)
    authorName: {
      type: String,
      required: true,
      trim: true
    },
    authorPhotoUrl: {
      type: String
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    isEdited: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/* -------------------- REACTION SCHEMA -------------------- */
const reactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["like", "love", "dislike"],
      required: true
    }
  },
  { timestamps: true }
);

/* -------------------- BLOG SCHEMA -------------------- */
const blogPostSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Snapshot author data
    authorName: {
      type: String,
      required: true,
      trim: true
    },
    authorRole: {
      type: String,
      enum: ["SEEKER", "EMPLOYER", "ADMIN"],
      required: true
    },
    authorPhotoUrl: {
      type: String
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    content: {
      type: String,
      required: true
    },

    reactions: [reactionSchema],
    comments: [commentSchema],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published"
    }
  },
  { timestamps: true }
);

/* -------------------- INDEXES -------------------- */
blogPostSchema.index({ authorId: 1 });
blogPostSchema.index({ "reactions.userId": 1 });

module.exports =
  mongoose.models.BlogPost ||
  mongoose.model("BlogPost", blogPostSchema);
