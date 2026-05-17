import User from "../models/User.js";
import Relationship from "../models/Relationship.js";

// GET USER
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password -verificationToken");
    if (!user) return res.status(404).json("User not found!");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    if (req.userInfo.id !== req.params.userId)
      return res.status(403).json("You can only update your own profile!");

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true }
    ).select("-password -verificationToken");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// SEARCH USERS
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json("Search query is required!");

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    })
      .select("-password -verificationToken")
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET SUGGESTED USERS (people you don't follow yet)
export const getSuggestedUsers = async (req, res) => {
  try {
    const relationships = await Relationship.find({ followerUserId: req.userInfo.id });
    const followingIds = relationships.map((r) => r.followedUserId);
    followingIds.push(req.userInfo.id);

    const users = await User.find({ _id: { $nin: followingIds } })
      .select("-password -verificationToken")
      .limit(5);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
