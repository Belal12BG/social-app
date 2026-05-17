import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axios";

const RightBar = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const [suggestions, setSuggestions] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axiosInstance.get("/users/suggestions");
        setSuggestions(res.data);
      } catch (err) {}
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    try {
      if (following.includes(userId)) {
        await axiosInstance.delete(`/relationships/${userId}/unfollow`);
        setFollowing((prev) => prev.filter((id) => id !== userId));
      } else {
        await axiosInstance.post(`/relationships/${userId}/follow`);
        setFollowing((prev) => [...prev, userId]);
      }
    } catch (err) {}
  };

  return (
    <div className="d-none d-xl-block" style={{ width: 280, minWidth: 280 }}>
      <div className="sticky-top pt-3" style={{ top: 70, zIndex: 1 }}>
        <div
          className={`card border-0 shadow-sm ${darkMode ? "bg-dark text-white" : ""}`}
        >
          <div className="card-body p-3">
            <h6 className="fw-bold mb-3">People you may know</h6>
            {suggestions.length === 0 ? (
              <p className="text-muted small">No suggestions right now</p>
            ) : (
              suggestions.map((user) => {
                const pic = user.profilePic
                  ? `http://localhost:8800/uploads/${user.profilePic}`
                  : `https://ui-avatars.com/api/?name=${user.name}&background=0d6efd&color=fff`;
                const isFollowing = following.includes(user._id);

                return (
                  <div
                    key={user._id}
                    className="d-flex align-items-center justify-content-between mb-3"
                  >
                    <Link
                      to={`/profile/${user._id}`}
                      className="d-flex align-items-center gap-2 text-decoration-none"
                    >
                      <img
                        src={pic}
                        alt=""
                        className="rounded-circle"
                        style={{ width: 38, height: 38, objectFit: "cover" }}
                      />
                      <div>
                        <div
                          className={`fw-medium small ${darkMode ? "text-white" : "text-dark"}`}
                        >
                          {user.name}
                        </div>
                        <div className="text-muted" style={{ fontSize: 11 }}>
                          @{user.username}
                        </div>
                      </div>
                    </Link>
                    <button
                      className={`btn btn-sm ${isFollowing ? "btn-outline-primary" : "btn-primary"}`}
                      style={{ fontSize: 12 }}
                      onClick={() => handleFollow(user._id)}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
