import { useState } from "react";
import { PostService, type IPost, type Like } from "../services/post.service";
import toast from "react-hot-toast";
import PostComments from "./PostComments";
import type { IUser } from "../services/user.service";

const Post = ({
  data,
  searchPostData,
  userData,
}: {
  data: IPost;
  searchPostData: () => {};
  userData: IUser;
}) => {
  const [isEdit, setIsEdit] = useState<IPost | null>();
  const [inputEdit, setInputEdit] = useState("");
  const [isOpenComment, setIsOpenComment] = useState(false);

  console.log(data);
  console.log(userData);

  const handleDeletePost = async (id: string) => {
    try {
      await PostService.delete(id);
      await searchPostData();
      toast.success("Publicação deletada com sucesso");
    } catch (error) {
      toast.error("Não foi possivel deletar esse post");
    }
  };

  const handleLikePost = async (id: string, likes: any) => {
    try {
      const liked = likes.find((like: Like) => like.userId === userData?.id);
      if (liked?.id) {
        await PostService.unlike(id);
      } else {
        await PostService.like(id);
      }
      await searchPostData();
    } catch (error) {
      toast.error("Algo de errado aconteceu");
    }
  };

  const handleEditPost = async (id: string, content: string) => {
    try {
      await PostService.update(id, { content });
      await searchPostData();
      setIsEdit(null);
    } catch (error) {
      toast.error("Algo de errado aconteceu");
    }
  };

  return (
    <article
      key={data.id}
      className="flex gap-3 p-4 cursor-pointer transition-colors hover:bg-white/2"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
        style={{
          background: "linear-gradient(135deg, #6d28d9, #a21caf)",
        }}
      >
        {data.user?.name?.[0]?.toUpperCase() ?? "U"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold text-sm text-slate-100">
            {data.user?.name ?? "Usuário"}
          </span>
          <span className="text-slate-600 text-sm">·</span>
          <span className="text-slate-500 text-sm">
            {new Date(data.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-300">
          {data.content}
        </p>
        <div className="flex gap-6 mt-3 text-sm text-slate-500">
          {/* Like */}
          <button
            className={`flex items-center gap-1.5 transition-colors group hover:text-pink-400 ${
              (data?.likes?.length ?? 0)
                ? "text-pink-400"
                : "text-slate-600 hover:text-pink-400"
            }`}
            onClick={() => handleLikePost(data.id, data.likes)}
          >
            <span className="p-1.5 rounded-full group-hover:bg-pink-500/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
              </svg>
            </span>
            {data?.likes?.length ?? 0}
          </button>

          {/* Delete */}
          {data.userId === userData.id && (
            <button
              className="flex items-center gap-1.5 transition-colors group hover:text-red-400"
              onClick={() => handleDeletePost(data.id)}
            >
              <span className="p-1.5 rounded-full group-hover:bg-red-500/10 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M6 7h12v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V7zm3 10h2V9H9v8zm4 0h2V9h-2v8zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                </svg>
              </span>
              Deletar
            </button>
          )}

          {/* Edit */}
          {data?.user?.id === userData.id && (
            <button
              className="flex items-center gap-1.5 transition-colors group hover:text-violet-400"
              onClick={() => {
                setIsEdit(data);
                setInputEdit(data.content);
              }}
            >
              <span className="p-1.5 rounded-full group-hover:bg-violet-500/10 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34c.38-.38.38-1 0-1.41l-2.34-2.34c-.38-.38-1-.38-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </span>
              Editar
            </button>
          )}

          {/* Comentários */}
          <button
            className={`flex items-center gap-1.5 transition-colors group ml-auto ${isOpenComment ? "text-violet-400" : "hover:text-violet-400"}`}
            onClick={() => setIsOpenComment((prev) => !prev)}
          >
            <span className="p-1.5 rounded-full group-hover:bg-violet-500/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v9c0 1.381-1.119 2.5-2.5 2.5H10.031l-4.242 4.243c-.293.293-.768.293-1.061 0-.14-.14-.22-.331-.22-.53V17H4.498c-1.381 0-2.5-1.119-2.5-2.5v-9zm2.5-.5c-.276 0-.5.224-.5.5v9c0 .276.224.5.5.5h2.5v2.379l3.038-3.038.22-.22c.14-.14.331-.22.53-.22h9.212c.276 0 .5-.224.5-.5v-9c0-.276-.224-.5-.5-.5h-15z" />
              </svg>
            </span>
            Comentários
          </button>
        </div>

        {isOpenComment && (
          <PostComments postId={data?.id} userId={userData?.id || ""} />
        )}
      </div>

      {isEdit && isEdit.id && isEdit.id.length > 2 && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{
            background: "rgba(7,7,20,0.75)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            style={{
              background: "rgba(20,10,40,0.98)",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            <h2 className="text-lg font-bold text-slate-100 mb-4">
              Editar publicação
            </h2>
            <div className="flex gap-3">
              <div
                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg, #6d28d9, #a21caf)",
                }}
              >
                {isEdit?.user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-slate-100 mb-2">
                  {isEdit?.user?.name ?? "Usuário"}
                </p>
                <textarea
                  value={inputEdit}
                  onChange={({ target: { value } }) => setInputEdit(value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none resize-none min-h-24 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                onClick={() => setIsEdit(null)}
              >
                Cancelar
              </button>
              <button
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
                style={{
                  background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
                }}
                onClick={() =>
                  isEdit?.id && handleEditPost(isEdit.id, inputEdit)
                }
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default Post;
