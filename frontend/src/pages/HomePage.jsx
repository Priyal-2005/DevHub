import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              Developer Portfolio Platform
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Publish your work, write your story, and grow your developer network.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                DevHub gives developers one place to manage their public profile, share technical posts,
                and stay connected with the people they follow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/login"} className="button-primary">
                {isAuthenticated ? "Open Feed" : "Login to DevHub"}
              </Link>
              <a
                href="http://localhost:5001/api"
                target="_blank"
                rel="noreferrer"
                className="button-secondary"
              >
                View Backend API
              </a>
            </div>
          </div>

          <div className="card shadow-glow p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Platform Snapshot</h2>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
                  Fullstack Ready
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Authentication</p>
                  <p className="mt-2 text-xl font-semibold text-white">JWT + Google OAuth</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Content</p>
                  <p className="mt-2 text-xl font-semibold text-white">Profiles, Posts, Feed</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Community</p>
                  <p className="mt-2 text-xl font-semibold text-white">Follow, Like, Comment</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Developer Flow</p>
                  <p className="mt-2 text-xl font-semibold text-white">Clean, Fast, Focused</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;
