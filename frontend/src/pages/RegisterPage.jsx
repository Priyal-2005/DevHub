import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <Layout>
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-4 py-16 sm:px-6">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Create account</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Start building your developer presence on DevHub.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Create your account to set up a profile, publish posts, and connect with other developers.
            </p>
            <Link to="/login" className="inline-flex text-sm font-medium text-emerald-300 hover:text-emerald-200">
              Already have an account? Login
            </Link>
          </div>

          <div className="card mx-auto w-full max-w-lg p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Register</h2>
                <p className="mt-2 text-sm text-slate-400">Create your DevHub account with email and password.</p>
              </div>

              <button type="button" onClick={handleGoogleRegister} className="button-secondary w-full">
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                  G
                </span>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                <span className="h-px flex-1 bg-slate-800" />
                <span>or</span>
                <span className="h-px flex-1 bg-slate-800" />
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-200">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="input"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

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
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="input"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                {error ? <p className="text-sm text-rose-300">{error}</p> : null}

                <button type="submit" disabled={isSubmitting} className="button-primary w-full">
                  {isSubmitting ? "Creating account..." : "Register"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default RegisterPage;
