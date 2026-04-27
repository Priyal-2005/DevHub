import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { getNotifications } from "../services/notificationService";
import { formatTimestamp } from "../utils/format";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getNotifications();
        setNotifications(data?.items || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Could not load notifications.");
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  return (
    <AppShell title="Notifications" subtitle="Keep up with follows, likes, and comments.">
      {isLoading ? <div className="card p-6 text-slate-300">Loading notifications...</div> : null}
      {error ? <div className="card p-6 text-rose-300">{error}</div> : null}

      {!isLoading && !error && notifications.length === 0 ? (
        <div className="card p-6 text-slate-400">No notifications yet.</div>
      ) : null}

      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-white">{item.message}</p>
                <p className="mt-2 text-sm capitalize text-slate-500">{item.type}</p>
              </div>
              <span className="text-sm text-slate-500">{formatTimestamp(item.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export default NotificationsPage;
