import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import toast from "react-hot-toast";

function HouseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

const inputBase = "rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" };
const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.border = "1px solid #7c3aed";
  e.currentTarget.style.background = "rgba(124,58,237,0.08)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.18)";
};
const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
  e.currentTarget.style.boxShadow = "none";
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      if (password !== confirm) {
        toast.error("As senhas não coincidem", { id: "register" });
        return;
      }
      toast.loading("Registrando...", { id: "register" });
      await authService.register({ name, email, password });
      toast.success("Sua conta foi criada", { id: "register" });

      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message, { id: "register" });
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8"
         style={{ background: "radial-gradient(ellipse at 65% 0%, rgba(124,58,237,0.2) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(168,85,247,0.13) 0%, transparent 50%), #070714" }}>
      <div className="flex w-full max-w-3xl min-h-125 rounded-3xl overflow-hidden"
           style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(24px)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>

        {/* ── Painel decorativo (desktop) ── */}
        <div className="hidden sm:flex flex-col justify-end p-10 w-72 shrink-0 relative overflow-hidden"
             style={{ background: "linear-gradient(145deg, #4c1d95 0%, #6d28d9 40%, #a21caf 100%)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
          <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
               style={{ background: "rgba(255,255,255,0.15)" }}>
            <HouseIcon className="w-8 h-8 fill-white" />
          </div>
          <h2 className="relative text-3xl font-extrabold text-white leading-tight mb-3 tracking-tight">
            Junte‑se ao<br />Pananbook
          </h2>
          <p className="relative text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Crie sua conta e faça parte da nossa comunidade. Posts, eventos, filmes e muito mais.
          </p>
        </div>

        {/* ── Formulário ── */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 py-10">
          {/* Logo (mobile) */}
          <div className="sm:hidden w-11 h-11 rounded-xl flex items-center justify-center mb-6"
               style={{ background: "linear-gradient(135deg, #6d28d9, #a21caf)" }}>
            <HouseIcon className="w-6 h-6 fill-white" />
          </div>

          <h1 className="text-2xl font-bold text-slate-100 mb-1 tracking-tight">Criar conta</h1>
          <p className="text-sm text-slate-500 mb-8">Preencha os campos abaixo para entrar na casa.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nome</label>
              <input id="name" type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required
                className={inputBase} style={{ ...inputStyle }} onFocus={inputFocus} onBlur={inputBlur} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-slate-400">E-mail</label>
              <input id="email" type="email" placeholder="exemplo@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                className={inputBase} style={{ ...inputStyle }} onFocus={inputFocus} onBlur={inputBlur} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-slate-400">Senha</label>
              <input id="password" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required
                className={inputBase} style={{ ...inputStyle }} onFocus={inputFocus} onBlur={inputBlur} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirm" className="text-xs font-semibold uppercase tracking-wide text-slate-400">Confirmar senha</label>
              <input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className={inputBase} style={{ ...inputStyle }} onFocus={inputFocus} onBlur={inputBlur} />
            </div>

            <button
              type="submit"
              className="mt-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-85 hover:-translate-y-px active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
            >
              Cadastrar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Já tem uma conta?{" "}
            <button
              type="button"
              className="text-violet-400 font-semibold hover:text-violet-300 hover:underline transition-colors"
              onClick={() => navigate("/login")}
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
