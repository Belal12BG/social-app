import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import axiosInstance from "../../utils/axios";

const Comments = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/comments/${postId}`);
        setComments(res.data);
      } catch (err) {}
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/comments/${postId}`, {
        desc: text,
      });
      setComments((prev) => [res.data, ...prev]);
      setText("");
    } catch (err) {}
    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {}
  };

  const profilePic = currentUser?.profilePic
    ? `http://localhost:8800/uploads/${currentUser.profilePic}`
    : `https://ui-avatars.com/api/?name=${currentUser?.name}&background=0d6efd&color=fff`;

  return (
    <div
      className={`mt-3 pt-3 border-top ${darkMode ? "border-secondary" : ""}`}
    >
      {/* Add comment */}
      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
        <img
          src={profilePic}
          alt=""
          className="rounded-circle"
          style={{ width: 32, height: 32, objectFit: "cover" }}
        />
        <div className="flex-grow-1 d-flex gap-2">
          <input
            className={`form-control form-control-sm ${darkMode ? "bg-secondary text-white border-secondary" : ""}`}
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="btn btn-primary btn-sm"
            type="submit"
            disabled={loading || !text.trim()}
          >
            <i className="bi bi-send"></i>
          </button>
        </div>
      </form>

      {/* Comments list */}
      {comments.map((comment) => {
        const pic = comment.userId?.profilePic
          ? `http://localhost:8800/uploads/${comment.userId.profilePic}`
          : `https://ui-avatars.com/api/?name=${comment.userId?.name}&background=0d6efd&color=fff`;

        return (
          <div key={comment._id} className="d-flex gap-2 mb-2">
            <img
              src={pic}
              alt=""
              className="rounded-circle"
              style={{ width: 32, height: 32, objectFit: "cover" }}
            />
            <div
              className={`flex-grow-1 rounded p-2 ${darkMode ? "bg-secondary" : "bg-light"}`}
            >
              <div className="d-flex justify-content-between align-items-start">
                <span className="fw-semibold" style={{ fontSize: 13 }}>
                  {comment.userId?.name}
                </span>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted" style={{ fontSize: 11 }}>
                    {moment(comment.createdAt).fromNow()}
                  </span>
                  {comment.userId?._id === currentUser?._id && (
                    <button
                      className="btn btn-sm border-0 text-danger p-0"
                      onClick={() => handleDelete(comment._id)}
                    >
                      <i className="bi bi-trash" style={{ fontSize: 12 }}></i>
                    </button>
                  )}
                </div>
              </div>
              <p className="mb-0 mt-1" style={{ fontSize: 13 }}>
                {comment.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
