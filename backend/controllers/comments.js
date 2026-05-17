import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

// GET COMMENTS FOR A POST
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 })
      .populate("userId", "name profilePic username");

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const newComment = new Comment({
      postId: req.params.postId,
      userId: req.userInfo.id,
      desc: req.body.desc,
    });

    const savedComment = await newComment.save();
    const populatedComment = await savedComment.populate("userId", "name profilePic username");

    // Create notification
    const post = await Post.findById(req.params.postId);
    if (post && post.userId.toString() !== req.userInfo.id) {
      await Notification.create({
        userId: post.userId,
        senderId: req.userInfo.id,
        type: "comment",
        postId: post._id,
      });
    }

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json("Comment not found!");
    if (comment.userId.toString() !== req.userInfo.id)
      return res.status(403).json("You can only delete your own comments!");

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment deleted successfully!");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
