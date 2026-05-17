import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
    <h1 className="display-1 fw-bold text-primary">404</h1>
    <h4 className="text-muted mb-4">Page not found</h4>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </div>
);

export default NotFound;
