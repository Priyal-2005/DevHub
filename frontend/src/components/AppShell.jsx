import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppShell({ title, subtitle, rightAside, children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <Sidebar />

        <div className="space-y-6">
          {(title || subtitle) ? (
            <section className="card p-6">
              {title ? <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1> : null}
              {subtitle ? <p className="mt-2 text-slate-400">{subtitle}</p> : null}
            </section>
          ) : null}
          {children}
        </div>

        <aside className="space-y-6">
          {rightAside || (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white">DevHub</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Share updates, discover developers you follow, and keep your profile active.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default AppShell;
