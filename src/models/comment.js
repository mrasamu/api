import mongoose from "mongoose";
import counter from "./counter";

const commentSchema = new mongoose.Schema(
  {
    id: Number, // use auto-increment id, instead of _id generated by database
    authorId: { type: Number, required: true },
    articleId: { type: Number, required: true }, // article's id
    content: { type: String, required: true }, // markdown
    replyTo: { type: Number, required: true }, // null means it's the parent，otherwise refers to its parent
    likes: { type: Number, default: 0 },
    likers: [Number],
    createdAt: { type: Date, default: Date.now },
    createdBy: Number,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: Number
  },
  {
    collection: "comments"
  }
);

/**
 * DO NOT USE ARROW FUNCTION HERE
 * problem of `this`
 */
commentSchema.pre("save", function(next) {
  const doc = this;
  counter.findByIdAndUpdate(
    "comment",
    { $inc: { count: 1 } },
    { new: true, upsert: true },
    (err, counter) => {
      if (err) return next(err);
      doc.id = counter.count;
      next();
    }
  );
});

export default mongoose.model("Comment", commentSchema);