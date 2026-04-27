import { useState } from "react";
import { Link } from "react-router-dom";
import { addComment } from "../services/commentService";
import { toggleLike } from "../services/postService";
import { formatTimestamp, getInitials } from "../utils/format";
import CommentList from "./CommentList";

function PostCard({ post, onPostUpdate }) {
  const [commentContent, setCommentContent] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentError, setCommentError] = useState("");

  const handleToggleLike = async () => {
    setIsLiking(true);

    const optimisticPost = {
      ...post,
      likesCount: post.likesCount + (post.isLiked ? -1 : 1),
      isLiked: !post.isLiked,
    };

    onPostUpdate(optimisticPost);

    try {
      await toggleLike(post.id);
      onPostUpdate({
        ...optimisticPost,
        likesCount: optimisticPost.likesCount,
      });
    } catch (error) {
      onPostUpdate(post);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    setCommentError("");

    if (!commentContent.trim()) {
      return;
    }

    setIsCommenting(true);

    try {
      const comment = await addComment({
        content: commentContent.trim(),
        postId: post.id,
      });

      onPostUpdate({
        ...post,
        commentsCount: post.commentsCount + 1,
        comments: [
          ...(post.comments || []),
          {
            ...comment,
            userName: "You",
          },
        ],
      });

      setCommentContent("");
    } catch (error) {
      setCommentError(error.response?.data?.message || "Could not add comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <article className="card p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-sm font-semibold text-slate-100">
          {getInitials(post.author?.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/profile/${post.author?.id}`} className="font-semibold text-white hover:text-emerald-300">
              {post.author?.name}
            </Link>
            <span className="text-sm text-slate-500">•</span>
            <span className="text-sm text-slate-500">{formatTimestamp(post.createdAt)}</span>
          </div>

          {post.title ? <h3 className="mt-3 text-xl font-semibold text-white">{post.title}</h3> : null}
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">{post.content}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <button
              type="button"
              onClick={handleToggleLike}
              disabled={isLiking}
              className={`rounded-full px-4 py-2 transition ${
                post.isLiked ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-900 text-slate-300 hover:text-white"
              }`}
            >
              {post.isLiked ? "Liked" : "Like"} · {post.likesCount}
            </button>
            <span>{post.commentsCount} comments</span>
          </div>

          <div className="mt-6 space-y-4 border-t border-slate-800 pt-5">
            <CommentList comments={post.comments} />

            <form onSubmit={handleSubmitComment} className="space-y-3">
              <textarea
                rows="3"
                value={commentContent}
                onChange={(event) => setCommentContent(event.target.value)}
                placeholder="Add a comment..."
                className="input resize-none"
              />

              {commentError ? <p className="text-sm text-rose-300">{commentError}</p> : null}

              <div className="flex justify-end">
                <button type="submit" disabled={isCommenting} className="button-secondary">
                  {isCommenting ? "Posting..." : "Comment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
