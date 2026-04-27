import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../hooks/useAuth";

function DashboardPage() {
  const { user } = useAuth();

  return (
    <AppShell title="Dashboard" subtitle="Your DevHub account overview at a glance.">
      <section className="card p-6">
        <h2 className="text-xl font-semibold text-white">Welcome back, {user?.name || "Developer"}.</h2>
        <p className="mt-3 text-slate-300">
          You are logged in as <span className="font-medium text-white">{user?.email}</span>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/feed" className="button-primary">
            Go to feed
          </Link>
          {user ? (
            <Link to={`/profile/${user.id}`} className="button-secondary">
              View profile
            </Link>
          ) : null}
          <Link to="/notifications" className="button-secondary">
            Notifications
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

export default DashboardPage;
