import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../redux/slices/authSlice";

const Login = () => {
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(inputs));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ width: "100%", maxWidth: 420 }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">
            <i className="bi bi-people-fill me-2"></i>SocialApp
          </h2>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter your username"
              value={inputs.username}
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
              placeholder="Enter your password"
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
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <hr className="my-4" />
        <p className="text-center text-muted mb-0">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary fw-medium text-decoration-none">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
