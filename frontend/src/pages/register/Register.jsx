import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../redux/slices/authSlice";

const Register = () => {
  const [inputs, setInputs] = useState({ name: "", username: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(inputs));
    if (registerUser.fulfilled.match(result)) {
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ width: "100%", maxWidth: 420 }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">
            <i className="bi bi-people-fill me-2"></i>SocialApp
          </h2>
          <p className="text-muted">Create your account</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {success && <div className="alert alert-success py-2 small">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={inputs.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-medium">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Choose a username"
              value={inputs.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-medium">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={inputs.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={inputs.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 fw-medium"
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <hr className="my-4" />
        <p className="text-center text-muted mb-0">
          Already have an account?{" "}
          <Link to="/login" className="text-primary fw-medium text-decoration-none">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
