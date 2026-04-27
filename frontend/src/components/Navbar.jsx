import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-800/70 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-semibold tracking-tight text-white">
          DevHub
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/feed" className="hidden text-sm font-medium text-slate-300 hover:text-white sm:inline-flex">
                Feed
              </Link>
              {user ? (
                <Link
                  to={`/profile/${user.id}`}
                  className="hidden text-sm font-medium text-slate-300 hover:text-white sm:inline-flex"
                >
                  Profile
                </Link>
              ) : null}
              <Link to="/notifications" className="hidden text-sm font-medium text-slate-300 hover:text-white sm:inline-flex">
                Notifications
              </Link>
            </>
          ) : null}

          {isAuthenticated && user ? (
            <span className="hidden rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 sm:inline-flex">
              {user.name}
            </span>
          ) : null}

          {isAuthenticated ? (
            <button type="button" onClick={handleLogout} className="button-secondary">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="button-secondary">
                Login
              </Link>
              <Link to="/register" className="button-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
