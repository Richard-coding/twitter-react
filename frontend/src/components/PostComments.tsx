import { useEffect, useState } from "react";
import CommentService from "../services/comment.service";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  name: string;
  authorInitials: string;
  gradientFrom: string;
  gradientTo: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  user: {
    id: string;
    name: string;
  };
}
interface PostCommentsProps {
  postId: string;
  userId: string;
}

export default function PostComments({ postId, userId }: PostCommentsProps) {
  // @ts-ignore
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");

  const handleSearchComment = async (postId: string) => {
    try {
      const response = await CommentService.findAllByPostId(postId);
      setComments(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateComment = async (postId: string, e: any) => {
    e.preventDefault();
    try {
      await CommentService.create(postId, { content: input });
      await handleSearchComment(postId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (id: any, commentId: string) => {
    try {
      await CommentService.delete(id, commentId);
      await handleSearchComment(postId);
      setInput("")
      toast.success("Comentário deletado com sucesso", {id: "comment"})
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearchComment(postId);
  }, []);

  return (
    <div
      className="mt-2 pt-3"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Input de comentário */}
      <form className="flex gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs"
          style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
        >
          VC
        </div>
        <div
          className="flex-1 flex items-center gap-2 rounded-2xl px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <input
            type="text"
            placeholder="Escreva um comentário..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="shrink-0 p-1.5 rounded-full transition-all disabled:opacity-30"
            style={{ color: "#a78bfa" }}
            onClick={(event) => {
              handleCreateComment(postId, event);
            }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Lista de comentários */}
      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs"
              style={{
                background: `linear-gradient(135deg, ${comment.gradientFrom}, ${comment.gradientTo})`,
              }}
            >
              {comment.authorInitials}
            </div>

            {/* Bubble */}
            <div className="flex-1 min-w-0">
              <div
                className="inline-block max-w-full rounded-2xl rounded-tl-sm px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-xs font-semibold text-violet-300 mb-0.5">
                  {comment?.user.name}
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {comment.content}
                </p>
              </div>

              {/* Actions below bubble */}
              <div className="flex items-center gap-3 mt-1.5 px-1">
                <span className="text-xs text-slate-600">{comment.time}</span>
                <button
                  className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                    comment.liked
                      ? "text-pink-400"
                      : "text-slate-600 hover:text-pink-400"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                    <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                  </svg>
                  {comment.likes > 0 && comment.likes}0
                </button>
                {userId !== comment.user.id && (
                  <button className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-violet-400 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                      <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                    </svg>
                    Responder
                  </button>
                )}
                {userId === comment.user.id && (
                  <button
                    className="text-xs flex items-center gap-1.5 transition-colors text-slate-600 group hover:text-red-400"
                    onClick={() => handleDeleteComment(postId, comment.id)}
                  >
                    <span className="p-1.5 rounded-full group-hover:bg-red-500/10 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M6 7h12v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V7zm3 10h2V9H9v8zm4 0h2V9h-2v8zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                      </svg>
                    </span>
                    Deletar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
