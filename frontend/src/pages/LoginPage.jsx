import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("error") === "oauth_failed") {
      setError("Google sign-in failed. Please try again.");
    }
  }, [location.search]);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <Layout>
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-4 py-16 sm:px-6">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Auth</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Welcome back to your developer home base.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Sign in with email or continue with Google to access your dashboard, profile, and activity
              feed.
            </p>
            <Link to="/" className="inline-flex text-sm font-medium text-sky-300 hover:text-sky-200">
              Back to home
            </Link>
          </div>

          <div className="card mx-auto w-full max-w-lg p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Login</h2>
                <p className="mt-2 text-sm text-slate-400">Use your DevHub credentials or Google account.</p>
              </div>

              <button type="button" onClick={handleGoogleLogin} className="button-secondary w-full">
                Continue with Google
              </button>

              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                <span className="h-px flex-1 bg-slate-800" />
                <span>or</span>
                <span className="h-px flex-1 bg-slate-800" />
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {error ? <p className="text-sm text-rose-300">{error}</p> : null}

                <button type="submit" disabled={isSubmitting} className="button-primary w-full">
                  {isSubmitting ? "Signing in..." : "Login"}
                </button>
              </form>

              <p className="text-sm text-slate-400">
                Need an account?{" "}
                <Link to="/register" className="font-medium text-emerald-300 hover:text-emerald-200">
                  Register
                </Link>
              </p>

              <p className="text-xs leading-6 text-slate-500">
                If your backend later redirects Google auth to the frontend with `?token=...`, DevHub is ready
                to complete that flow automatically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default LoginPage;
