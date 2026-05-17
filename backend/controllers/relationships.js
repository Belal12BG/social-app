import Relationship from "../models/Relationship.js";
import Notification from "../models/Notification.js";

// GET FOLLOWERS
export const getFollowers = async (req, res) => {
  try {
    const relationships = await Relationship.find({ followedUserId: req.params.userId })
      .populate("followerUserId", "name profilePic username");

    res.status(200).json(relationships.map((r) => r.followerUserId));
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET FOLLOWING
export const getFollowing = async (req, res) => {
  try {
    const relationships = await Relationship.find({ followerUserId: req.params.userId })
      .populate("followedUserId", "name profilePic username");

    res.status(200).json(relationships.map((r) => r.followedUserId));
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// FOLLOW USER
export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userInfo.id;

    if (targetUserId === currentUserId)
      return res.status(400).json("You can't follow yourself!");

    const existingRelationship = await Relationship.findOne({
      followerUserId: currentUserId,
      followedUserId: targetUserId,
    });

    if (existingRelationship) return res.status(409).json("Already following this user!");

    await Relationship.create({
      followerUserId: currentUserId,
      followedUserId: targetUserId,
    });

    // Create notification
    await Notification.create({
      userId: targetUserId,
      senderId: currentUserId,
      type: "follow",
    });

    res.status(200).json("Followed successfully!");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// UNFOLLOW USER
export const unfollowUser = async (req, res) => {
  try {
    await Relationship.findOneAndDelete({
      followerUserId: req.userInfo.id,
      followedUserId: req.params.userId,
    });

    res.status(200).json("Unfollowed successfully!");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
