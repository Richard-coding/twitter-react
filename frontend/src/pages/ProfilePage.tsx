import { useState } from "react";
import AppSidebar from "../components/AppSidebar";

const MOCK_USER = {
  name: "Ana Silva",
  username: "anasilva",
  bio: "Moradora há 2 anos 🏠 • Amante de filmes e boa comida • Organizo a lista de compras com amor ❤️",
  joinedAt: "Março de 2024",
  avatarInitials: "AS",
  stats: { posts: 47, followers: 6, following: 5 },
  isOwnProfile: true,
};

const MOCK_POSTS = [
  {
    id: "1",
    content: "Alguém lembrou de comprar detergente? Acabou aqui 😅",
    time: "há 2h",
    likes: 3,
    comments: 2,
  },
  {
    id: "2",
    content: "Assistimos Duna 2 hoje à noite? Eu faço a pipoca 🍿",
    time: "há 1 dia",
    likes: 5,
    comments: 4,
  },
  {
    id: "3",
    content: "Lembrete: reunião de contas sexta-feira às 20h na sala!",
    time: "há 3 dias",
    likes: 6,
    comments: 1,
  },
  {
    id: "4",
    content: "O banheiro tá impecável, obrigada a quem limpou 🫶",
    time: "há 5 dias",
    likes: 7,
    comments: 3,
  },
];

const MOCK_LIKED = [
  {
    id: "l1",
    authorName: "Carlos",
    authorInitials: "CA",
    content: "Churrasco no domingo confirmado! Quem traz o carvão?",
    time: "há 3h",
    likes: 5,
  },
  {
    id: "l2",
    authorName: "Fernanda",
    authorInitials: "FE",
    content: "Série nova na Netflix: Nobody Wants This. Recomendo demais! 📺",
    time: "há 2 dias",
    likes: 4,
  },
];

type Tab = "posts" | "likes";

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("posts");
  const [following, setFollowing] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(MOCK_USER.bio);
  const [bioInput, setBioInput] = useState(MOCK_USER.bio);

  return (
    <main className="grid grid-cols-[auto_1fr_auto] h-dvh max-w-7xl mx-auto bg-[#070714] text-slate-100 font-sans">
      <AppSidebar />

      {/* ── CONTEÚDO ── */}
      <section
        className="overflow-y-auto"
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Header com volta */}
        <div
          className="sticky top-0 z-10 backdrop-blur-sm px-4 py-3 flex items-center gap-4"
          style={{
            background: "rgba(7,7,20,0.85)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-slate-100">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-100">{MOCK_USER.name}</h1>
            <p className="text-xs text-slate-500">{MOCK_USER.stats.posts} posts</p>
          </div>
        </div>

        {/* Banner */}
        <div
          className="h-36 w-full relative"
          style={{
            background:
              "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #6d28d9 70%, #a21caf 100%)",
          }}
        >
          {/* Padrão decorativo sutil */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c026d3 0%, transparent 40%)",
            }}
          />
        </div>

        {/* Avatar + ações */}
        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-12 mb-4">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full border-4 flex items-center justify-center text-white font-extrabold text-2xl shrink-0"
              style={{
                background: "linear-gradient(135deg, #6d28d9, #a21caf)",
                borderColor: "#070714",
              }}
            >
              {MOCK_USER.avatarInitials}
            </div>

            {/* Botão */}
            <div className="mt-14">
              {MOCK_USER.isOwnProfile ? (
                <button
                  onClick={() => setEditingBio(true)}
                  className="px-5 py-2 rounded-full text-sm font-bold border transition-all hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "#e2e8f0" }}
                >
                  Editar perfil
                </button>
              ) : (
                <button
                  onClick={() => setFollowing((f) => !f)}
                  className="px-5 py-2 rounded-full text-sm font-bold transition-all"
                  style={
                    following
                      ? {
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "#e2e8f0",
                          background: "transparent",
                        }
                      : {
                          background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
                          color: "white",
                        }
                  }
                >
                  {following ? "Seguindo" : "Seguir"}
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-slate-100">{MOCK_USER.name}</h2>
            <p className="text-slate-500 text-sm mb-3">@{MOCK_USER.username}</p>

            {editingBio ? (
              <div className="mb-3">
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full bg-transparent text-sm text-slate-200 resize-none outline-none rounded-xl p-3"
                  style={{ border: "1px solid rgba(109,40,217,0.5)" }}
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => setEditingBio(false)}
                    className="px-4 py-1.5 text-sm rounded-full text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => { setBio(bioInput); setEditingBio(false); }}
                    className="px-4 py-1.5 text-sm rounded-full font-bold text-white transition-all hover:opacity-85"
                    style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed mb-3">{bio}</p>
            )}

            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm-7-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              <span>Entrou em {MOCK_USER.joinedAt}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-5 mb-1 text-sm">
            <button className="hover:underline">
              <span className="font-bold text-slate-100">{MOCK_USER.stats.following}</span>
              <span className="text-slate-500 ml-1">Seguindo</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-slate-100">{MOCK_USER.stats.followers}</span>
              <span className="text-slate-500 ml-1">Seguidores</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {(["posts", "likes"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                tab === t ? "text-slate-100" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "posts" ? "Posts" : "Curtidas"}
              {tab === t && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full"
                  style={{ background: "linear-gradient(90deg, #6d28d9, #a21caf)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Lista */}
        {tab === "posts" ? (
          MOCK_POSTS.map((post) => (
            <article
              key={post.id}
              className="flex gap-3 p-4 hover:bg-white/2 transition-colors cursor-pointer"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #6d28d9, #a21caf)" }}
              >
                {MOCK_USER.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-bold text-sm text-slate-100">{MOCK_USER.name}</span>
                  <span className="text-slate-600 text-sm">·</span>
                  <span className="text-slate-500 text-sm">{post.time}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{post.content}</p>
                <div className="flex gap-5 mt-3 text-slate-500 text-sm">
                  <span className="flex items-center gap-1.5 hover:text-pink-400 transition-colors cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                    </svg>
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-violet-400 transition-colors cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v9c0 1.381-1.119 2.5-2.5 2.5H10.031l-4.242 4.243c-.293.293-.768.293-1.061 0-.14-.14-.22-.331-.22-.53V17H4.498c-1.381 0-2.5-1.119-2.5-2.5v-9zm2.5-.5c-.276 0-.5.224-.5.5v9c0 .276.224.5.5.5h2.5v2.379l3.038-3.038.22-.22c.14-.14.331-.22.53-.22h9.212c.276 0 .5-.224.5-.5v-9c0-.276-.224-.5-.5-.5h-15z" />
                    </svg>
                    {post.comments}
                  </span>
                </div>
              </div>
            </article>
          ))
        ) : (
          MOCK_LIKED.map((post) => (
            <article
              key={post.id}
              className="flex gap-3 p-4 hover:bg-white/2 transition-colors cursor-pointer"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #065f46, #059669)" }}
              >
                {post.authorInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-bold text-sm text-slate-100">{post.authorName}</span>
                  <span className="text-slate-600 text-sm">·</span>
                  <span className="text-slate-500 text-sm">{post.time}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{post.content}</p>
                <div className="flex gap-5 mt-3 text-pink-400 text-sm">
                  <span className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                    </svg>
                    {post.likes}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* ── SIDEBAR DIREITA (vazia / placeholder) ── */}
      <aside className="px-4 py-3 w-72 hidden xl:block" />
    </main>
  );
}
