import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const LeftBar = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const profilePic = currentUser?.profilePic
    ? `http://localhost:8800/uploads/${currentUser.profilePic}`
    : `https://ui-avatars.com/api/?name=${currentUser?.name}&background=0d6efd&color=fff`;

  const menuItems = [
    { icon: "bi-house", label: "Home", to: "/" },
    { icon: "bi-person", label: "Profile", to: `/profile/${currentUser?._id}` },
    { icon: "bi-bell", label: "Notifications", to: "/notifications" },
    { icon: "bi-chat-dots", label: "Messages", to: "/messages" },
  ];

  return (
    <div className="d-none d-lg-block" style={{ width: 240, minWidth: 240 }}>
      <div className="sticky-top pt-3" style={{ top: 70 }}>
        {/* Profile Card */}
        <div
          className={`card border-0 shadow-sm mb-3 ${darkMode ? "bg-dark text-white" : ""}`}
        >
          <div className="card-body text-center p-3">
            <img
              src={profilePic}
              alt=""
              className="rounded-circle mb-2"
              style={{ width: 60, height: 60, objectFit: "cover" }}
            />
            <div className="fw-semibold">{currentUser?.name}</div>
            <div className="text-muted small">@{currentUser?.username}</div>
          </div>
        </div>

        {/* Menu */}
        <div
          className={`card border-0 shadow-sm ${darkMode ? "bg-dark text-white" : ""}`}
        >
          <div className="card-body p-2">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`d-flex align-items-center gap-3 p-2 rounded text-decoration-none mb-1 ${darkMode ? "text-white" : "text-dark"}`}
                style={{ transition: "background 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = darkMode
                    ? "#333"
                    : "#f0f2f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span className="fw-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
