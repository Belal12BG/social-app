import { useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axios";

const Share = ({ onPostCreated }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const profilePic = currentUser?.profilePic
    ? currentUser.profilePic
    : `https://ui-avatars.com/api/?name=${currentUser?.name}&background=0d6efd&color=fff`;

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim() && !file) return;
    setLoading(true);
    try {
      let imgUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axiosInstance.post("/upload", formData);
        imgUrl = uploadRes.data.url;
      }
      const res = await axiosInstance.post("/posts", { desc, img: imgUrl });
      onPostCreated(res.data);
      setDesc("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`card border-0 shadow-sm mb-3 ${darkMode ? "bg-dark text-white" : ""}`}
    >
      <div className="card-body">
        <div className="d-flex gap-3 align-items-start">
          <img
            src={profilePic}
            alt=""
            className="rounded-circle"
            style={{ width: 42, height: 42, objectFit: "cover" }}
          />
          <textarea
            className={`form-control border-0 resize-none ${darkMode ? "bg-secondary text-white" : "bg-light"}`}
            rows={2}
            placeholder={`What's on your mind, ${currentUser?.name}?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ resize: "none" }}
          />
        </div>

        {preview && (
          <div className="mt-2 position-relative d-inline-block">
            <img
              src={preview}
              alt=""
              className="rounded"
              style={{ maxHeight: 200, maxWidth: "100%", objectFit: "cover" }}
            />
            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-0"
              style={{ width: 24, height: 24, lineHeight: 1 }}
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
            >
              <i className="bi bi-x" style={{ fontSize: 14 }}></i>
            </button>
          </div>
        )}

        <hr className={darkMode ? "border-secondary" : ""} />

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <label
              className="d-flex align-items-center gap-1 text-success"
              style={{ cursor: "pointer", fontSize: 14 }}
            >
              <input
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleFile}
              />
              <i className="bi bi-image fs-5"></i>
              <span>Photo</span>
            </label>
          </div>
          <button
            className="btn btn-primary btn-sm px-4"
            onClick={handleSubmit}
            disabled={loading || (!desc.trim() && !file)}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              "Share"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Share;
