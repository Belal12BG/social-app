import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { toggleDarkMode } from "../../redux/slices/themeSlice";
import axiosInstance from "../../utils/axios";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axiosInstance.get("/notifications/unread-count");
        setUnreadCount(res.data.count);
      } catch (err) {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    try {
      const res = await axiosInstance.get(`/users/search?q=${val}`);
      setSearchResults(res.data);
      setShowSearch(true);
    } catch (err) {}
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const profilePic = currentUser?.profilePic
    ? `http://localhost:8800/uploads/${currentUser.profilePic}`
    : `https://ui-avatars.com/api/?name=${currentUser?.name}&background=0d6efd&color=fff`;

  return (
    <nav
      className="sticky-top shadow-sm px-3 py-2"
      style={{ background: darkMode ? "#212529" : "#fff", zIndex: 1000 }}
    >
      <div className="d-flex align-items-center gap-3">
        {/* Brand */}
        <Link
          to="/"
          className="text-primary fw-bold fs-5 text-decoration-none me-2"
          style={{ whiteSpace: "nowrap" }}
        >
          <i className="bi bi-people-fill me-1"></i>SocialApp
        </Link>

        {/* Search */}
        <div
          className="position-relative flex-grow-1"
          style={{ maxWidth: 300 }}
          ref={searchRef}
        >
          <div className="input-group input-group-sm">
            <span
              className="input-group-text border-end-0"
              style={{
                background: darkMode ? "#495057" : "#f8f9fa",
                borderColor: darkMode ? "#6c757d" : "#dee2e6",
              }}
            >
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchResults.length > 0 && setShowSearch(true)}
              style={{
                background: darkMode ? "#495057" : "#f8f9fa",
                color: darkMode ? "#fff" : "#000",
                borderColor: darkMode ? "#6c757d" : "#dee2e6",
              }}
            />
          </div>

          {showSearch && searchResults.length > 0 && (
            <div
              className="position-absolute w-100 shadow rounded mt-1 overflow-hidden"
              style={{
                top: "100%",
                zIndex: 9999,
                background: darkMode ? "#343a40" : "#fff",
                border: "1px solid " + (darkMode ? "#6c757d" : "#dee2e6"),
              }}
            >
              {searchResults.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  className="d-flex align-items-center gap-2 p-2 text-decoration-none"
                  style={{ color: darkMode ? "#fff" : "#000" }}
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <img
                    src={
                      user.profilePic
                        ? `http://localhost:8800/uploads/${user.profilePic}`
                        : `https://ui-avatars.com/api/?name=${user.name}&background=0d6efd&color=fff`
                    }
                    alt=""
                    className="rounded-circle"
                    style={{ width: 32, height: 32, objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#6c757d" }}>
                      @{user.username}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          {/* Dark Mode */}
          <button
            className="btn btn-sm border-0"
            style={{ color: darkMode ? "#fff" : "#6c757d" }}
            onClick={() => dispatch(toggleDarkMode())}
          >
            <i
              className={`bi ${darkMode ? "bi-sun-fill" : "bi-moon-fill"} fs-6`}
            ></i>
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="btn btn-sm border-0 position-relative"
            style={{ color: darkMode ? "#fff" : "#6c757d" }}
          >
            <i className="bi bi-bell-fill fs-6"></i>
            {unreadCount > 0 && (
              <span
                className="position-absolute bg-danger text-white rounded-pill"
                style={{
                  fontSize: 9,
                  top: 2,
                  right: 2,
                  minWidth: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Messages */}
          <Link
            to="/messages"
            className="btn btn-sm border-0"
            style={{ color: darkMode ? "#fff" : "#6c757d" }}
          >
            <i className="bi bi-chat-dots-fill fs-6"></i>
          </Link>

          {/* User Menu */}
          <div className="position-relative" ref={userMenuRef}>
            <button
              className="btn p-0 border-0"
              onClick={() => setShowUserMenu((prev) => !prev)}
            >
              <img
                src={profilePic}
                alt=""
                className="rounded-circle"
                style={{
                  width: 36,
                  height: 36,
                  objectFit: "cover",
                  border: "2px solid #0d6efd",
                }}
              />
            </button>

            {showUserMenu && (
              <div
                className="position-absolute shadow rounded overflow-hidden"
                style={{
                  top: "45px",
                  right: 0,
                  minWidth: 190,
                  zIndex: 9999,
                  background: darkMode ? "#343a40" : "#fff",
                  border: "1px solid " + (darkMode ? "#6c757d" : "#dee2e6"),
                }}
              >
                {/* User Info */}
                <div
                  style={{
                    padding: "10px 16px",
                    borderBottom:
                      "1px solid " + (darkMode ? "#6c757d" : "#dee2e6"),
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: darkMode ? "#fff" : "#000",
                    }}
                  >
                    {currentUser?.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#6c757d" }}>
                    @{currentUser?.username}
                  </div>
                </div>

                {/* My Profile */}
                <Link
                  to={`/profile/${currentUser?._id}`}
                  className="text-decoration-none d-flex align-items-center gap-2"
                  style={{
                    padding: "10px 16px",
                    fontSize: 14,
                    color: darkMode ? "#fff" : "#000",
                    display: "block",
                  }}
                  onClick={() => setShowUserMenu(false)}
                >
                  <i className="bi bi-person"></i>
                  <span>My Profile</span>
                </Link>

                {/* Divider */}
                <div
                  style={{
                    borderTop:
                      "1px solid " + (darkMode ? "#6c757d" : "#dee2e6"),
                  }}
                />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    fontSize: 14,
                    color: "#dc3545",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
