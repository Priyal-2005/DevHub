import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import PostCard from "../components/PostCard";
import { useAuth } from "../hooks/useAuth";
import { getFeed } from "../services/feedService";
import { createPost } from "../services/postService";
import { getNotifications } from "../services/notificationService";

const makeOptimisticPost = (user, content) => ({
  id: `temp-${Date.now()}`,
  title: "",
  content,
  createdAt: new Date().toISOString(),
  author: {
    id: user?.id,
    name: user?.name,
    avatar: user?.avatar,
  },
  likesCount: 0,
  commentsCount: 0,
  comments: [],
  isLiked: false,
});

function FeedPage() {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const [composerError, setComposerError] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [feedData, notificationData] = await Promise.all([getFeed({ page: 1, limit: 20 }), getNotifications()]);
        setFeed(feedData?.items || []);
        setNotifications(notificationData?.items || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Could not load your feed.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, []);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    setComposerError("");

    const content = postContent.trim();
    if (!content) {
      setComposerError("Write something before posting.");
      return;
    }

    setIsPosting(true);
    const optimisticPost = makeOptimisticPost(user, content);
    setFeed((current) => [optimisticPost, ...current]);
    setPostContent("");

    try {
      const createdPost = await createPost({
        title: content.slice(0, 60),
        content,
      });

      setFeed((current) =>
        current.map((item) =>
          item.id === optimisticPost.id
            ? {
                ...createdPost,
                comments: createdPost.comments || [],
                commentsCount: createdPost.commentsCount || createdPost._count?.comments || 0,
                likesCount: createdPost.likesCount || createdPost._count?.likes || 0,
                isLiked: false,
              }
            : item
        )
      );
    } catch (requestError) {
      setFeed((current) => current.filter((item) => item.id !== optimisticPost.id));
      setComposerError(requestError.response?.data?.message || "Could not publish your post.");
      setPostContent(content);
    } finally {
      setIsPosting(false);
    }
  };

  const updatePost = (nextPost) => {
    setFeed((current) => current.map((item) => (item.id === nextPost.id ? nextPost : item)));
  };

  const rightAside = (
    <>
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white">Quick profile</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-400">
          <p className="text-base font-medium text-white">{user?.name}</p>
          <p>{user?.email}</p>
          <p>Stay active to grow your network and keep your feed fresh.</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white">Recent notifications</h2>
        <div className="mt-4 space-y-3">
          {notifications.length ? (
            notifications.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-sm text-white">{item.message}</p>
                <p className="mt-1 text-xs text-slate-500">{item.type}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No notifications yet.</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <AppShell title="Developer feed" subtitle="Updates from people you follow, plus your latest posts." rightAside={rightAside}>
      <section className="card p-6">
        <form className="space-y-4" onSubmit={handleCreatePost}>
          <div>
            <label htmlFor="post-content" className="sr-only">
              Share an update
            </label>
            <textarea
              id="post-content"
              rows="4"
              className="input resize-none"
              placeholder="Share an update, lesson, or idea..."
              value={postContent}
              onChange={(event) => setPostContent(event.target.value)}
            />
          </div>
          {composerError ? <p className="text-sm text-rose-300">{composerError}</p> : null}
          <div className="flex justify-end">
            <button type="submit" disabled={isPosting} className="button-primary">
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </section>

      {isLoading ? <div className="card p-6 text-slate-300">Loading your feed...</div> : null}
      {error ? <div className="card p-6 text-rose-300">{error}</div> : null}

      {!isLoading && !error && feed.length === 0 ? (
        <div className="card p-6 text-slate-400">No posts yet. Follow developers to populate your feed.</div>
      ) : null}

      <div className="space-y-4">
        {feed.map((post) => (
          <PostCard key={post.id} post={post} onPostUpdate={updatePost} />
        ))}
      </div>
    </AppShell>
  );
}

export default FeedPage;
