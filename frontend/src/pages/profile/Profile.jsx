import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axios";
import Posts from "../../components/posts/Posts";

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const isOwner = currentUser?._id === userId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, followersRes] = await Promise.all([
          axiosInstance.get(`/users/${userId}`),
          axiosInstance.get(`/relationships/${userId}/followers`),
        ]);
        setUser(userRes.data);
        setEditData({
          name: userRes.data.name,
          city: userRes.data.city,
          website: userRes.data.website,
          bio: userRes.data.bio,
        });
        setFollowersCount(followersRes.data.length);
        setIsFollowing(
          followersRes.data.some((f) => f._id === currentUser?._id),
        );
      } catch (err) {}
      setLoading(false);
    };
    fetchData();
  }, [userId, currentUser?._id]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axiosInstance.delete(`/relationships/${userId}/unfollow`);
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        await axiosInstance.post(`/relationships/${userId}/follow`);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (err) {}
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/users/${userId}`, editData);
      setUser(res.data);
      setEditMode(false);
    } catch (err) {}
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  if (!user)
    return <div className="text-center py-5 text-muted">User not found</div>;

  const profilePic = user.profilePic
    ? `http://localhost:8800/uploads/${user.profilePic}`
    : `https://ui-avatars.com/api/?name=${user.name}&background=0d6efd&color=fff&size=128`;

  const coverPic = user.coverPic
    ? `http://localhost:8800/uploads/${user.coverPic}`
    : null;

  return (
    <div>
      {/* Cover */}
      <div
        className="position-relative"
        style={{
          height: 220,
          background: coverPic
            ? `url(${coverPic}) center/cover`
            : "linear-gradient(135deg, #0d6efd, #6610f2)",
        }}
      >
        <div className="position-absolute" style={{ bottom: -40, left: 24 }}>
          <img
            src={profilePic}
            alt=""
            className="rounded-circle border border-4 border-white shadow"
            style={{ width: 90, height: 90, objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Profile Info */}
      <div
        className={`${darkMode ? "bg-dark text-white" : "bg-white"} shadow-sm`}
        style={{ paddingTop: 50 }}
      >
        <div className="container-fluid px-4 pb-3">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-0">{user.name}</h5>
              <span className="text-muted small">@{user.username}</span>
              {user.bio && (
                <p className="mt-1 mb-0" style={{ fontSize: 14 }}>
                  {user.bio}
                </p>
              )}
              <div className="d-flex gap-3 mt-2">
                {user.city && (
                  <span className="text-muted small">
                    <i className="bi bi-geo-alt me-1"></i>
                    {user.city}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary small"
                  >
                    <i className="bi bi-link-45deg me-1"></i>
                    {user.website}
                  </a>
                )}
              </div>
              <div className="d-flex gap-3 mt-2">
                <span className="small">
                  <strong>{followersCount}</strong>{" "}
                  <span className="text-muted">Followers</span>
                </span>
              </div>
            </div>
            <div>
              {isOwner ? (
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setEditMode(true)}
                >
                  <i className="bi bi-pencil me-1"></i>Edit Profile
                </button>
              ) : (
                <button
                  className={`btn btn-sm ${isFollowing ? "btn-outline-primary" : "btn-primary"}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${darkMode ? "bg-dark text-white" : ""}`}
            >
              <div className="modal-header border-0">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditMode(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  {["name", "city", "website", "bio"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label text-capitalize fw-medium">
                        {field}
                      </label>
                      <input
                        className={`form-control ${darkMode ? "bg-secondary text-white border-secondary" : ""}`}
                        value={editData[field] || ""}
                        onChange={(e) =>
                          setEditData((p) => ({
                            ...p,
                            [field]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      <div style={{ maxWidth: 600, margin: "0 auto" }} className="py-3 px-2">
        <Posts userId={userId} />
      </div>
    </div>
  );
};

export default Profile;
