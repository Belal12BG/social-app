import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axiosInstance from "../../utils/axios";
import Comments from "../comments/Comments";

const Post = ({ post, onDelete }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isLiked = likes.includes(currentUser?._id);
  const isOwner = post.userId?._id === currentUser?._id;

  const profilePic = post.userId?.profilePic
    ? post.userId.profilePic
    : `https://ui-avatars.com/api/?name=${post.userId?.name}&background=0d6efd&color=fff`;

  const handleLike = async () => {
    try {
      await axiosInstance.put(`/posts/${post._id}/like`);
      setLikes((prev) =>
        isLiked
          ? prev.filter((id) => id !== currentUser._id)
          : [...prev, currentUser._id],
      );
    } catch (err) {}
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axiosInstance.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (err) {}
  };

  return (
    <div
      className={`card border-0 shadow-sm mb-3 ${darkMode ? "bg-dark text-white" : ""}`}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link
            to={`/profile/${post.userId?._id}`}
            className="d-flex align-items-center gap-2 text-decoration-none"
          >
            <img
              src={profilePic}
              alt=""
              className="rounded-circle"
              style={{ width: 42, height: 42, objectFit: "cover" }}
            />
            <div>
              <div
                className={`fw-semibold small ${darkMode ? "text-white" : "text-dark"}`}
              >
                {post.userId?.name}
              </div>
              <div className="text-muted" style={{ fontSize: 11 }}>
                {moment(post.createdAt).fromNow()}
              </div>
            </div>
          </Link>

          {isOwner && (
            <div className="position-relative">
              <button
                className="btn btn-sm btn-outline-secondary border-0"
                onClick={() => setShowMenu(!showMenu)}
              >
                <i className="bi bi-three-dots"></i>
              </button>
              {showMenu && (
                <div
                  className={`position-absolute end-0 shadow rounded p-1 z-3 ${darkMode ? "bg-dark border border-secondary" : "bg-white border"}`}
                  style={{ minWidth: 120 }}
                >
                  <button
                    className="btn btn-sm text-danger w-100 text-start"
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash me-2"></i>Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {post.desc && (
          <p className="mb-2" style={{ fontSize: 15 }}>
            {post.desc}
          </p>
        )}
        {post.img && (
          <img
            src={post.img}
            alt=""
            className="w-100 rounded mb-2"
            style={{ maxHeight: 500, objectFit: "cover" }}
          />
        )}

        <div
          className={`d-flex gap-3 pt-2 border-top ${darkMode ? "border-secondary" : ""}`}
        >
          <button
            className={`btn btn-sm border-0 d-flex align-items-center gap-1 ${isLiked ? "text-danger" : "text-muted"}`}
            onClick={handleLike}
          >
            <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
            <span style={{ fontSize: 13 }}>{likes.length}</span>
          </button>

          <button
            className="btn btn-sm border-0 text-muted d-flex align-items-center gap-1"
            onClick={() => setShowComments(!showComments)}
          >
            <i className="bi bi-chat"></i>
            <span style={{ fontSize: 13 }}>Comment</span>
          </button>

          <button className="btn btn-sm border-0 text-muted d-flex align-items-center gap-1">
            <i className="bi bi-share"></i>
            <span style={{ fontSize: 13 }}>Share</span>
          </button>
        </div>

        {showComments && <Comments postId={post._id} />}
      </div>
    </div>
  );
};

export default Post;
