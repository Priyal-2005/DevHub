import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

const getTokenFromUrl = () => {
  const url = new URL(window.location.href);
  return url.searchParams.get("token") || new URLSearchParams(url.hash.replace(/^#/, "")).get("token");
};

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { completeGoogleAuth } = useAuth();
  const [error, setError] = useState("");
  const [isCompleting, setIsCompleting] = useState(true);

  useEffect(() => {
    const finishAuth = async () => {
      try {
        const token = getTokenFromUrl();

        if (!token) {
          setError("Google authentication did not return a valid token.");
          return;
        }

        await completeGoogleAuth(token);
        navigate("/dashboard", { replace: true });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Google sign-in could not be completed.");
      } finally {
        setIsCompleting(false);
      }
    };

    finishAuth();
  }, [completeGoogleAuth, navigate]);

  return (
    <Layout>
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl items-center px-4 py-16 sm:px-6">
        <div className="card w-full p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {error ? "Google Sign-in Incomplete" : "Completing Google Sign-in"}
          </h1>
          <p className="mt-4 text-slate-300">
            {error || "Please wait while we finish authenticating your DevHub session."}
          </p>
          {!error && isCompleting ? <p className="mt-3 text-sm text-slate-500">Finalizing session...</p> : null}
        </div>
      </section>
    </Layout>
  );
}

export default OAuthCallbackPage;
