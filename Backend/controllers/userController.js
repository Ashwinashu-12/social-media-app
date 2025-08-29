import User from "../models/User.js";
import Post from "../models/Post.js"; // used for profile posts gating (if you have Post)
import Notification from "../models/Notification.js"; // optional

// Toggle privacy (private/public)
export const togglePrivacy = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isPrivate = !user.isPrivate;
    await user.save();
    res.json({ isPrivate: user.isPrivate });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Follow someone (auto-follow if public; else create pending request)
export const requestOrFollow = async (req, res) => {
  try {
    const me = req.user._id;
    const targetId = req.params.id;
    if (me.toString() === targetId) return res.status(400).json({ message: "Cannot follow yourself" });

    const meUser = await User.findById(me);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    // Already following?
    if (target.followers.includes(me)) {
      return res.json({ status: "following" });
    }

    if (target.isPrivate) {
      // If already requested
      if (target.followRequests.includes(me)) {
        return res.json({ status: "requested" });
      }
      target.followRequests.push(me);
      await target.save();

      // optional notification
      try {
        await Notification.create({ user: targetId, from: me, type: "follow_request", text: "requested to follow you" });
      } catch {}

      return res.json({ status: "requested" });
    } else {
      // Public: follow immediately
      target.followers.addToSet(me);
      meUser.following.addToSet(targetId);
      await target.save();
      await meUser.save();

      // optional notification
      try {
        await Notification.create({ user: targetId, from: me, type: "follow", text: "started following you" });
      } catch {}

      return res.json({ status: "following" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Accept a follow request (target = me, requester = :id)
export const acceptFollow = async (req, res) => {
  try {
    const me = req.user._id;
    const requesterId = req.params.id;

    const meUser = await User.findById(me);
    if (!meUser.followRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No such pending request" });
    }

    // Remove from pending
    meUser.followRequests.pull(requesterId);
    // Add follower
    meUser.followers.addToSet(requesterId);
    await meUser.save();

    // Add to requester's following
    await User.findByIdAndUpdate(requesterId, { $addToSet: { following: me } });

    // optional notification
    try {
      await Notification.create({ user: requesterId, from: me, type: "follow_accept", text: "accepted your follow request" });
    } catch {}

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Reject a follow request
export const rejectFollow = async (req, res) => {
  try {
    const me = req.user._id;
    const requesterId = req.params.id;

    const meUser = await User.findById(me);
    if (!meUser.followRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No such pending request" });
    }

    meUser.followRequests.pull(requesterId);
    await meUser.save();

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Unfollow someone (me stops following :id)
export const unfollowUser = async (req, res) => {
  try {
    const me = req.user._id;
    const targetId = req.params.id;

    await User.findByIdAndUpdate(me, { $pull: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { followers: me } });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get my pending follow requests
export const getMyFollowRequests = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).populate("followRequests", "name avatar");
    res.json(me.followRequests || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get a user public profile (with privacy gating for posts)
export const getUserProfileWithPrivacy = async (req, res) => {
  try {
    const viewerId = req.user?._id; // authenticated viewer
    const targetId = req.params.id;

    const user = await User.findById(targetId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // can view posts if:
    // - user is not private, or
    // - viewer is the user themself, or
    // - viewer is a follower of the user
    const canViewPosts =
      !user.isPrivate ||
      (viewerId && viewerId.toString() === user._id.toString()) ||
      (viewerId && user.followers.map(String).includes(viewerId.toString()));

    let posts = [];
    if (canViewPosts) {
      posts = await Post.find({ author: targetId }).sort({ createdAt: -1 });
    }

    res.json({
      user,
      privacy: { isPrivate: user.isPrivate, canViewPosts },
      posts
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
