import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import PostService from "../services/post.service";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  user?: { username: string };
}

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [input, setInput] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const handleVerifyUser = async () => {
    try {
      if (!token) {
        navigate("/login");
      } else {
        await authService.getMe();
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
    } catch (error) {}
  };

  const handlePost = async () => {
    try {
      await PostService.create({ content: input });
      await searchPostData();
    } catch (error) {}
  };

  return (
    <main className="grid grid-cols-[1fr_2fr_1fr] h-dvh max-w-7xl mx-auto bg-black text-white font-sans">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="flex flex-col px-4 py-3 border-r border-zinc-800 sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="p-3 mb-2">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {[
            {
              label: "Home",
              active: true,
              icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.844-.455v8.516c0 1.14.927 2.067 2.066 2.067h14.667c1.14 0 2.066-.927 2.066-2.067V8.435l.844.455c.364.197.82.06 1.017-.304.196-.363.06-.82-.303-1.017zm-5.066 9.867H6.608v-7.72c0-.07.015-.136.02-.205l5.372-2.9 5.372 2.9c.006.07.02.136.02.205v7.72z" />
                </svg>
              ),
            },
            {
              label: "Explore",
              active: false,
              icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.814 5.262l4.276 4.276-1.414 1.414-4.276-4.276c-1.447 1.132-3.276 1.814-5.272 1.814-4.694 0-8.5-3.806-8.5-8.5z" />
                </svg>
              ),
            },
            {
              label: "Notifications",
              active: false,
              icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 15H1v2h3.882l.856-6.526C6.147 7.3 8.745 5 11.996 5s5.85 2.3 6.258 5.474L19.114 17H23v-2h-1.866l-1.143-5.969C19.48 5.017 16.054 2 11.996 2zM9 18c0 1.65 1.35 3 3 3s3-1.35 3-3H9z" />
                </svg>
              ),
            },
            {
              label: "Messages",
              active: false,
              icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v9c0 1.381-1.119 2.5-2.5 2.5H10.031l-4.242 4.243c-.293.293-.768.293-1.061 0-.14-.14-.22-.331-.22-.53V17H4.498c-1.381 0-2.5-1.119-2.5-2.5v-9zm2.5-.5c-.276 0-.5.224-.5.5v9c0 .276.224.5.5.5h2.5v2.379l3.038-3.038.22-.22c.14-.14.331-.22.53-.22h9.212c.276 0 .5-.224.5-.5v-9c0-.276-.224-.5-.5-.5h-15z" />
                </svg>
              ),
            },
            {
              label: "Profile",
              active: false,
              icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z" />
                </svg>
              ),
            },
          ].map(({ label, active, icon }) => (
            <button
              key={label}
              className={`flex items-center gap-4 px-4 py-3 rounded-full text-xl transition-colors w-fit ${
                active
                  ? "font-bold text-white"
                  : "font-normal text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {icon}
              <span className="hidden xl:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* Post button */}
        <button className="mt-4 bg-sky-500 hover:bg-sky-400 transition-colors text-white font-bold rounded-full py-3 px-6 hidden xl:block">
          Post
        </button>
        <button className="mt-4 bg-sky-500 hover:bg-sky-400 transition-colors text-white font-bold rounded-full p-3 xl:hidden w-fit">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-2.549 9.19-6.88 1.156-2.998 1.68-6.232 1.81-9.12zm-3.22 5.19C18.5 11.63 16.36 14 13 14H8.55c.57-2.22 1.66-4.45 3.44-6.11C13.77 6.19 16.37 5.12 19.63 5.05l.15 3.14zM20 22h2c0-5-1.52-9.48-4.33-12.86C14.19 5.77 9.76 3.6 4 3H2c0 5.669 2.04 10.73 5.56 14.56C10.32 20.79 14.85 22 20 22z" />
          </svg>
        </button>

        {/* User avatar at bottom */}
        <div className="mt-auto flex items-center gap-3 p-3 rounded-full hover:bg-zinc-900 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
            JD
          </div>
          <div className="hidden xl:block flex-1 min-w-0">
            <p className="font-bold text-sm truncate">John Doe</p>
            <p className="text-zinc-500 text-sm truncate">@johndoe</p>
          </div>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-zinc-500 hidden xl:block">
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
          </svg>
        </div>
      </aside>

      {/* ── MAIN FEED ── */}
      <section className="border-x border-zinc-800 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-zinc-800 px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>

        {/* Compose area */}
        <div className="flex gap-3 p-4 border-b border-zinc-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
            JD
          </div>
          <div className="flex-1">
            <textarea
              placeholder="What's happening?"
              className="w-full bg-transparent text-xl placeholder-zinc-600 resize-none outline-none pt-2 min-h-[80px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-800">
              <div className="flex gap-2 text-sky-500">
                {/* Image icon */}
                <button className="p-2 rounded-full hover:bg-sky-500/10 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 1-1 3 3H18.5c.276 0 .5-.224.5-.5V5.5c0-.276-.224-.5-.5-.5h-13zM12 7.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5S14.328 9 13.5 9 12 8.328 12 7.5z" />
                  </svg>
                </button>
                {/* Emoji icon */}
                <button className="p-2 rounded-full hover:bg-sky-500/10 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.683 4.948 3.683s4.898-3.533 4.949-3.683l-1.898-.633c-.029.089-.826 2.316-3.051 2.316zM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-2 0c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8 8-3.582 8-8z" />
                  </svg>
                </button>
              </div>
              <button onClick={handlePost} className="bg-sky-500 hover:bg-sky-400 transition-colors text-white font-bold rounded-full px-5 py-2 text-sm">
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Posts da API */}
        {posts.map((post) => (
          <article key={post.id} className="flex gap-3 p-4 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
              {post.user?.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-bold text-sm">{post.user?.username ?? "Usuário"}</span>
                <span className="text-zinc-500 text-sm">·</span>
                <span className="text-zinc-500 text-sm">{new Date(post.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-zinc-100">{post.content}</p>
              <div className="flex gap-6 mt-3 text-zinc-500 text-sm">
                <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors group">
                  <span className="p-1.5 rounded-full group-hover:bg-pink-500/10 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                    </svg>
                  </span>
                  {post.likesCount ?? 0}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ── RIGHT SIDEBAR ── */}
      <aside className="px-4 py-3 overflow-y-auto sticky top-0 h-screen">
        {/* Search bar */}
        <div className="relative mb-4">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-zinc-500 absolute left-3 top-1/2 -translate-y-1/2">
            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.814 5.262l4.276 4.276-1.414 1.414-4.276-4.276c-1.447 1.132-3.276 1.814-5.272 1.814-4.694 0-8.5-3.806-8.5-8.5z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-zinc-900 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-sky-500 placeholder-zinc-500"
            readOnly
          />
        </div>

        {/* Who to follow */}
        <div className="bg-zinc-900/60 rounded-2xl p-4 mb-4">
          <h2 className="text-xl font-extrabold mb-3">Who to follow</h2>
          {[
            { initials: "TS", from: "from-teal-500", to: "to-green-500", name: "Tech Semanal", handle: "@techsemanal", followers: "12.4K" },
            { initials: "JN", from: "from-blue-600", to: "to-cyan-500", name: "JS News Brasil", handle: "@jsnewsbrasil", followers: "8.9K" },
            { initials: "DV", from: "from-rose-500", to: "to-orange-500", name: "Dev Vibes", handle: "@devvibes", followers: "31.2K" },
          ].map(({ initials, from, to, name, handle, followers }) => (
            <div key={handle} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${from} ${to} flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{name}</p>
                  <p className="text-zinc-500 text-xs">{handle}</p>
                </div>
              </div>
              <button className="ml-3 bg-white hover:bg-zinc-200 transition-colors text-black font-bold rounded-full px-4 py-1.5 text-sm flex-shrink-0">
                Follow
              </button>
            </div>
          ))}
          <button className="text-sky-500 hover:text-sky-400 text-sm mt-1">Show more</button>
        </div>

        {/* Trending */}
        <div className="bg-zinc-900/60 rounded-2xl p-4">
          <h2 className="text-xl font-extrabold mb-3">Trending</h2>
          {[
            { category: "Technology · Trending", tag: "#NestJS", posts: "5,432 posts" },
            { category: "Desenvolvimento · Trending", tag: "#ReactJS", posts: "18.9K posts" },
            { category: "Tech · Trending", tag: "#TypeScript", posts: "12.1K posts" },
            { category: "Brasil · Trending", tag: "#DevBrasil", posts: "3,201 posts" },
          ].map(({ category, tag, posts }) => (
            <div key={tag} className="py-2.5 hover:bg-zinc-800/50 rounded-xl px-2 -mx-2 cursor-pointer transition-colors">
              <p className="text-zinc-500 text-xs">{category}</p>
              <p className="font-bold text-sm">{tag}</p>
              <p className="text-zinc-500 text-xs">{posts}</p>
            </div>
          ))}
          <button className="text-sky-500 hover:text-sky-400 text-sm mt-1">Show more</button>
        </div>
      </aside>
    </main>
  );
};

export default HomePage;
