import Post from "../models/Post.js";
import User from "../models/User.js";
import Relationship from "../models/Relationship.js";
import Notification from "../models/Notification.js";

// GET FEED POSTS (posts from people you follow + your own)
export const getFeedPosts = async (req, res) => {
  try {
    const relationships = await Relationship.find({ followerUserId: req.userInfo.id });
    const followingIds = relationships.map((r) => r.followedUserId);
    followingIds.push(req.userInfo.id);

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ userId: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name profilePic username");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET USER POSTS
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name profilePic username");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.userInfo.id,
      desc: req.body.desc,
      img: req.body.img || "",
    });

    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate("userId", "name profilePic username");

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json("Post not found!");
    if (post.userId.toString() !== req.userInfo.id)
      return res.status(403).json("You can only update your own posts!");

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: { desc: req.body.desc, img: req.body.img } },
      { new: true }
    ).populate("userId", "name profilePic username");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json("Post not found!");
    if (post.userId.toString() !== req.userInfo.id)
      return res.status(403).json("You can only delete your own posts!");

    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Post deleted successfully!");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// LIKE / UNLIKE POST
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json("Post not found!");

    const userId = req.userInfo.id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.findByIdAndUpdate(req.params.postId, { $pull: { likes: userId } });

      // Remove notification
      await Notification.findOneAndDelete({
        userId: post.userId,
        senderId: userId,
        type: "like",
        postId: post._id,
      });

      return res.status(200).json("Post unliked!");
    } else {
      await Post.findByIdAndUpdate(req.params.postId, { $push: { likes: userId } });

      // Create notification (only if not your own post)
      if (post.userId.toString() !== userId) {
        await Notification.create({
          userId: post.userId,
          senderId: userId,
          type: "like",
          postId: post._id,
        });
      }

      return res.status(200).json("Post liked!");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};
