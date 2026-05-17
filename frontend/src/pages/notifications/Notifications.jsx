import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axiosInstance from "../../utils/axios";

const Notifications = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notifications");
        setNotifications(res.data);
        await axiosInstance.put("/notifications/mark-read");
      } catch (err) {}
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <i className="bi bi-heart-fill text-danger fs-5"></i>;
      case "comment":
        return <i className="bi bi-chat-fill text-primary fs-5"></i>;
      case "follow":
        return <i className="bi bi-person-plus-fill text-success fs-5"></i>;
      case "message":
        return <i className="bi bi-envelope-fill text-warning fs-5"></i>;
      default:
        return <i className="bi bi-bell-fill fs-5"></i>;
    }
  };

  const getText = (n) => {
    switch (n.type) {
      case "like":
        return `${n.senderId?.name} liked your post`;
      case "comment":
        return `${n.senderId?.name} commented on your post`;
      case "follow":
        return `${n.senderId?.name} started following you`;
      case "message":
        return `${n.senderId?.name} sent you a message`;
      default:
        return "New notification";
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }} className="py-3 px-2">
      <h5 className="fw-bold mb-3">Notifications</h5>
      {notifications.length === 0 ? (
        <div
          className={`card border-0 shadow-sm text-center py-5 ${darkMode ? "bg-dark text-white" : ""}`}
        >
          <i className="bi bi-bell-slash fs-1 text-muted d-block mb-2"></i>
          <span className="text-muted">No notifications yet</span>
        </div>
      ) : (
        notifications.map((n) => {
          const pic = n.senderId?.profilePic
            ? `http://localhost:8800/uploads/${n.senderId.profilePic}`
            : `https://ui-avatars.com/api/?name=${n.senderId?.name}&background=0d6efd&color=fff`;

          return (
            <div
              key={n._id}
              className={`card border-0 shadow-sm mb-2 ${darkMode ? "bg-dark text-white" : ""} ${!n.isRead ? (darkMode ? "border-start border-primary border-3" : "border-start border-primary border-3") : ""}`}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <Link to={`/profile/${n.senderId?._id}`}>
                  <img
                    src={pic}
                    alt=""
                    className="rounded-circle"
                    style={{ width: 44, height: 44, objectFit: "cover" }}
                  />
                </Link>
                <div className="flex-grow-1">
                  <span style={{ fontSize: 14 }}>{getText(n)}</span>
                  <div className="text-muted" style={{ fontSize: 11 }}>
                    {moment(n.createdAt).fromNow()}
                  </div>
                </div>
                {getIcon(n.type)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Notifications;
