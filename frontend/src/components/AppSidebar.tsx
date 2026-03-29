import { useLocation, useNavigate } from "react-router-dom";

function HouseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

const navItems = [
  {
    label: "Início",
    path: "/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.844-.455v8.516c0 1.14.927 2.067 2.066 2.067h14.667c1.14 0 2.066-.927 2.066-2.067V8.435l.844.455c.364.197.82.06 1.017-.304.196-.363.06-.82-.303-1.017zm-5.066 9.867H6.608v-7.72c0-.07.015-.136.02-.205l5.372-2.9 5.372 2.9c.006.07.02.136.02.205v7.72z" />
      </svg>
    ),
  },
  {
    label: "Compras",
    path: "/shopping",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14.75L7.2 14.6l.9-1.6h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z" />
      </svg>
    ),
  },
  {
    label: "Filmes",
    path: "/movies",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
    ),
  },
  {
    label: "Eventos",
    path: "/events",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    ),
  },
  {
    label: "Melhorias",
    path: "/improvements",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user: { name?: string; username?: string } = JSON.parse(
    localStorage.getItem("user") || "{}",
  );
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <aside
      className="flex flex-col px-4 py-3 sticky top-0 h-screen overflow-y-auto"
      style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Logo */}
      <div className="p-3 mb-2 flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #6d28d9, #a21caf)" }}
        >
          <HouseIcon className="w-5 h-5 fill-white" />
        </div>
        <span className="hidden xl:block text-lg font-extrabold tracking-tight text-slate-100">
          Pananbook
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, path, icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-full text-base transition-colors w-fit ${
                active
                  ? "font-bold text-violet-400"
                  : "font-normal text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              {icon}
              <span className="hidden xl:inline">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Publicar */}
      <button
        className="mt-4 text-white font-bold rounded-full py-3 px-6 hidden xl:block transition-all hover:opacity-85"
        style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
      >
        Publicar
      </button>
      <button
        className="mt-4 text-white font-bold rounded-full p-3 xl:hidden w-fit transition-all hover:opacity-85"
        style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
        </svg>
      </button>

      {/* Avatar */}
      <div
        className="mt-auto flex items-center gap-3 p-3 rounded-full cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => {
          navigate(`/profile/${user.username}`);
        }}
      >
        <div
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #6d28d9, #a21caf)" }}
        >
          {userInitials}
        </div>
        <div className="hidden xl:block flex-1 min-w-0">
          <p className="font-bold text-sm truncate text-slate-100">
            {user?.name ?? "Usuário"}
          </p>
          <p className="text-slate-500 text-sm truncate">
            @{user?.name?.toLowerCase().replace(/\s/g, "") ?? "user"}
          </p>
        </div>
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-slate-500 hidden xl:block"
        >
          <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
        </svg>
      </div>
    </aside>
  );
}
