import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService, { type IUserAuth } from "../services/auth.service";
import PostService, { type IPost } from "../services/post.service";
import AppSidebar from "../components/AppSidebar";
import formatInitials from "../utils/formatInitials";
import Post from "../components/Post";

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [input, setInput] = useState("");
  const [posts, setPosts] = useState<IPost[]>([]);

  const [user, setUser] = useState<IUserAuth>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  const handleVerifyUser = async () => {
    try {
      if (!token) {
        navigate("/login");
      } else {
        const response = await authService.getMe();
        setUser(response);
        searchPostData();
      }
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    handleVerifyUser();
  }, []);

  const searchPostData = async () => {
    try {
      const response = await PostService.findAll();
      setPosts(response);
      toast.success("Publicações atualizadas");
    } catch (error) {}
  };

  const handleCreatePost = async () => {
    try {
      toast.success("Publicado com sucesso", { id: "post" });
      await PostService.create({ content: input });
      await searchPostData();
      setInput("");
    } catch (error) {
      toast.error("Algo deu errado na criação");
    }
  };

  return (
    <main className="grid grid-cols-[auto_1fr_auto] h-dvh max-w-7xl mx-auto bg-[#070714] text-slate-100 font-sans">
      <AppSidebar />

      {/* ── FEED PRINCIPAL ── */}
      <section
        className="overflow-y-auto"
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 backdrop-blur-sm px-4 py-3"
          style={{
            background: "rgba(7,7,20,0.8)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h1 className="text-xl font-bold text-slate-100">Início</h1>
        </div>

        {/* Área de composição */}
        <div
          className="flex gap-3 p-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #6d28d9, #a21caf)" }}
          >
            {formatInitials(user.name)}
          </div>
          <div className="flex-1">
            <textarea
              placeholder="O que está rolando na casa?"
              className="w-full bg-transparent text-lg placeholder-slate-600 resize-none outline-none pt-2 min-h-20 text-slate-100"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div
              className="flex items-center justify-between mt-2 pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex gap-2 text-violet-500">
                <button className="p-2 rounded-full hover:bg-violet-500/10 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 1-1 3 3H18.5c.276 0 .5-.224.5-.5V5.5c0-.276-.224-.5-.5-.5h-13zM12 7.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5S14.328 9 13.5 9 12 8.328 12 7.5z" />
                  </svg>
                </button>
                <button className="p-2 rounded-full hover:bg-violet-500/10 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.683 4.948 3.683s4.898-3.533 4.949-3.683l-1.898-.633c-.029.089-.826 2.316-3.051 2.316zM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-2 0c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8 8-3.582 8-8z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleCreatePost}
                className="text-white font-bold rounded-full px-5 py-2 text-sm transition-all hover:opacity-85"
                style={{
                  background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
                }}
              >
                Publicar
              </button>
            </div>
          </div>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <Post
            key={post.id}
            data={post}
            searchPostData={searchPostData}
            userData={user}
          />
        ))}
      </section>

      {/* ── SIDEBAR DIREITA ── */}
      <aside className="px-4 py-3 overflow-y-auto sticky top-0 h-screen">
        {/* Busca */}
        <div className="relative mb-4">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
          >
            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.814 5.262l4.276 4.276-1.414 1.414-4.276-4.276c-1.447 1.132-3.276 1.814-5.272 1.814-4.694 0-8.5-3.806-8.5-8.5z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar"
            className="w-full rounded-full py-2.5 pl-10 pr-4 text-sm outline-none placeholder-slate-500 text-slate-100 transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            readOnly
          />
        </div>

        {/* Moradores da Casa */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2 className="text-base font-bold mb-3 text-slate-100">
            Moradores da Casa
          </h2>
          {[
            { initials: "AN", from: "#6d28d9", to: "#a21caf", name: "Ana" },
            {
              initials: "BE",
              from: "#0369a1",
              to: "#0891b2",
              name: "Bernardo",
            },
            { initials: "CA", from: "#065f46", to: "#059669", name: "Carlos" },
            { initials: "DE", from: "#92400e", to: "#d97706", name: "Débora" },
            { initials: "ED", from: "#7f1d1d", to: "#dc2626", name: "Eduardo" },
            {
              initials: "FE",
              from: "#1e3a5f",
              to: "#3b82f6",
              name: "Fernanda",
            },
            { initials: "GU", from: "#3d1d7f", to: "#8b5cf6", name: "Gustavo" },
          ].map(({ initials, from, to, name }) => (
            <div key={name} className="flex items-center gap-3 py-2">
              <div
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs"
                style={{
                  background: `linear-gradient(135deg, ${from}, ${to})`,
                }}
              >
                {initials}
              </div>
              <p className="text-sm font-medium text-slate-300">{name}</p>
            </div>
          ))}
        </div>

        {/* Atividade Recente */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2 className="text-base font-bold mb-3 text-slate-100">
            Atividade Recente
          </h2>
          {[
            { label: "Posts hoje", value: posts.length.toString() },
            {
              label: "Curtidas no feed",
              value: posts
                .reduce((acc, p) => acc + (p.likes?.length ?? 0), 0)
                .toString(),
            },
            { label: "Moradores ativos", value: "7" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="text-sm font-bold text-violet-400">{value}</p>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
};

export default HomePage;
