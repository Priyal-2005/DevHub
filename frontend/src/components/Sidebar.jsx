import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../utils/format";

const linkClassName = ({ isActive }) =>
  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-emerald-500/15 text-emerald-300"
      : "text-slate-300 hover:bg-slate-900 hover:text-white"
  }`;

function Sidebar() {
  const { user } = useAuth();

  const links = [
    { label: "Feed", to: "/feed" },
    { label: "Profile", to: user ? `/profile/${user.id}` : "/feed" },
    { label: "Notifications", to: "/notifications" },
  ];

  return (
    <aside className="card h-fit p-4 lg:sticky lg:top-6">
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-sm font-bold text-slate-950">
          {getInitials(user?.name)}
        </div>
        <div>
          <p className="text-lg font-semibold text-white">DevHub</p>
          <p className="text-sm text-slate-400">{user?.name || "Developer"}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClassName}>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
