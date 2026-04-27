import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function NotFoundPage() {
  return (
    <Layout>
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl items-center px-4 py-16 text-center sm:px-6">
        <div className="w-full space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">404</p>
          <h1 className="text-4xl font-semibold text-white">Page not found</h1>
          <p className="text-slate-300">The page you’re looking for doesn’t exist in this DevHub frontend.</p>
          <Link to="/" className="button-primary">
            Back Home
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export default NotFoundPage;
