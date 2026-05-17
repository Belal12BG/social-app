import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import axiosInstance from "../../utils/axios";

const Messages = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get("/messages/conversations");
        setConversations(res.data);
      } catch (err) {}
      setLoading(false);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(
          `/messages/conversations/${activeConv._id}`,
        );
        setMessages(res.data);
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      } catch (err) {}
    };
    fetchMessages();
  }, [activeConv]);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchQ(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axiosInstance.get(`/users/search?q=${val}`);
      setSearchResults(res.data.filter((u) => u._id !== currentUser._id));
    } catch (err) {}
  };

  const startConversation = async (user) => {
    try {
      const res = await axiosInstance.post("/messages/conversations", {
        receiverId: user._id,
      });
      setActiveConv(res.data);
      setSearchQ("");
      setSearchResults([]);
      if (!conversations.find((c) => c._id === res.data._id)) {
        setConversations((prev) => [res.data, ...prev]);
      }
    } catch (err) {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConv) return;
    try {
      const res = await axiosInstance.post(
        `/messages/conversations/${activeConv._id}`,
        { text },
      );
      setMessages((prev) => [...prev, res.data]);
      setText("");
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } catch (err) {}
  };

  const getOtherParticipant = (conv) =>
    conv.participants?.find((p) => p._id !== currentUser._id);

  const cardBg = darkMode ? "bg-dark text-white" : "bg-white";
  const borderColor = darkMode ? "border-secondary" : "";

  return (
    <div className="container-fluid py-3 px-2" style={{ maxWidth: 900 }}>
      <div
        className={`card border-0 shadow-sm ${cardBg}`}
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div className="row g-0 h-100">
          {/* LEFT: Conversations */}
          <div className={`col-4 border-end ${borderColor} d-flex flex-column`}>
            <div
              className="p-3 border-bottom"
              style={{ borderColor: darkMode ? "#444" : undefined }}
            >
              <h6 className="fw-bold mb-2">Messages</h6>
              <div className="position-relative">
                <input
                  className={`form-control form-control-sm ${darkMode ? "bg-secondary text-white border-secondary" : ""}`}
                  placeholder="Search users..."
                  value={searchQ}
                  onChange={handleSearch}
                />
                {searchResults.length > 0 && (
                  <div
                    className={`position-absolute w-100 shadow rounded mt-1 z-3 ${darkMode ? "bg-dark border border-secondary" : "bg-white border"}`}
                    style={{ top: "100%" }}
                  >
                    {searchResults.map((u) => {
                      const pic = u.profilePic
                        ? `http://localhost:8800/uploads/${u.profilePic}`
                        : `https://ui-avatars.com/api/?name=${u.name}&background=0d6efd&color=fff`;
                      return (
                        <div
                          key={u._id}
                          className={`d-flex align-items-center gap-2 p-2 ${darkMode ? "text-white" : "text-dark"}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => startConversation(u)}
                        >
                          <img
                            src={pic}
                            alt=""
                            className="rounded-circle"
                            style={{
                              width: 32,
                              height: 32,
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <div className="fw-medium small">{u.name}</div>
                            <div
                              className="text-muted"
                              style={{ fontSize: 11 }}
                            >
                              @{u.username}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-auto flex-grow-1">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center text-muted py-4 small">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  const pic = other?.profilePic
                    ? `http://localhost:8800/uploads/${other.profilePic}`
                    : `https://ui-avatars.com/api/?name=${other?.name}&background=0d6efd&color=fff`;
                  const isActive = activeConv?._id === conv._id;

                  return (
                    <div
                      key={conv._id}
                      className={`d-flex align-items-center gap-2 p-3 border-bottom ${borderColor}`}
                      style={{
                        cursor: "pointer",
                        background: isActive
                          ? darkMode
                            ? "#333"
                            : "#e8f0fe"
                          : "transparent",
                      }}
                      onClick={() => setActiveConv(conv)}
                    >
                      <img
                        src={pic}
                        alt=""
                        className="rounded-circle"
                        style={{ width: 42, height: 42, objectFit: "cover" }}
                      />
                      <div className="overflow-hidden">
                        <div className="fw-medium small text-truncate">
                          {other?.name}
                        </div>
                        <div
                          className="text-muted text-truncate"
                          style={{ fontSize: 11 }}
                        >
                          {conv.lastMessage || "Start a conversation"}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Chat */}
          <div className="col-8 d-flex flex-column">
            {!activeConv ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                <i className="bi bi-chat-dots fs-1 mb-2"></i>
                <span>Select a conversation or search for a user</span>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                {(() => {
                  const other = getOtherParticipant(activeConv);
                  const pic = other?.profilePic
                    ? `http://localhost:8800/uploads/${other.profilePic}`
                    : `https://ui-avatars.com/api/?name=${other?.name}&background=0d6efd&color=fff`;
                  return (
                    <div
                      className={`p-3 border-bottom d-flex align-items-center gap-2 ${borderColor}`}
                    >
                      <img
                        src={pic}
                        alt=""
                        className="rounded-circle"
                        style={{ width: 38, height: 38, objectFit: "cover" }}
                      />
                      <div>
                        <div className="fw-semibold small">{other?.name}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>
                          @{other?.username}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Messages */}
                <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-2">
                  {messages.map((msg) => {
                    const isMine = msg.senderId?._id === currentUser._id;
                    return (
                      <div
                        key={msg._id}
                        className={`d-flex ${isMine ? "justify-content-end" : "justify-content-start"}`}
                      >
                        <div
                          className={`px-3 py-2 rounded-3 ${isMine ? "bg-primary text-white" : darkMode ? "bg-secondary text-white" : "bg-light text-dark"}`}
                          style={{ maxWidth: "70%", fontSize: 14 }}
                        >
                          <div>{msg.text}</div>
                          <div
                            className={`${isMine ? "text-white-50" : "text-muted"}`}
                            style={{ fontSize: 10, textAlign: "right" }}
                          >
                            {moment(msg.createdAt).format("h:mm A")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={sendMessage}
                  className={`p-3 border-top d-flex gap-2 ${borderColor}`}
                >
                  <input
                    className={`form-control form-control-sm ${darkMode ? "bg-secondary text-white border-secondary" : ""}`}
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm px-3"
                    type="submit"
                    disabled={!text.trim()}
                  >
                    <i className="bi bi-send"></i>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
