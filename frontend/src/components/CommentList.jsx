import { formatTimestamp, getInitials } from "../utils/format";

function CommentList({ comments }) {
  if (!comments?.length) {
    return <p className="text-sm text-slate-500">No comments yet. Start the conversation.</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-200">
              {getInitials(comment.user?.name || comment.userName || "D")}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{comment.user?.name || comment.userName || "Developer"}</p>
              <p className="text-xs text-slate-500">{formatTimestamp(comment.createdAt)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
