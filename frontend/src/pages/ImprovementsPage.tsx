import { useEffect, useState } from "react";
import AppSidebar from "../components/AppSidebar";
import ImprovementService from "../services/improvement.service";
import type { IUser } from "../services/user.service";

type ImprovementType = "FEATURE" | "BUG";
type ImprovementStatus = "OPEN" | "IN_PROGRESS" | "DONE";

interface Improvement {
  id: string;
  title: string;
  description?: string;
  type: ImprovementType;
  status: ImprovementStatus;
  createdBy: IUser;
  createdAt: string;
}

const TYPE_CONFIG: Record<
  ImprovementType,
  { label: string; color: React.CSSProperties; icon: string }
> = {
  FEATURE: {
    label: "Feature",
    color: { background: "rgba(37,99,235,0.15)", color: "#60a5fa" },
    icon: "✨",
  },
  BUG: {
    label: "Bug",
    color: { background: "rgba(220,38,38,0.15)", color: "#f87171" },
    icon: "🐛",
  },
};

const STATUS_CONFIG: Record<
  ImprovementStatus,
  { label: string; color: React.CSSProperties }
> = {
  OPEN: {
    label: "Aberta",
    color: { background: "rgba(100,116,139,0.15)", color: "#94a3b8" },
  },
  IN_PROGRESS: {
    label: "Em andamento",
    color: { background: "rgba(234,179,8,0.15)", color: "#facc15" },
  },
  DONE: {
    label: "Concluída",
    color: { background: "rgba(5,150,105,0.15)", color: "#34d399" },
  },
};

const STATUSES: ImprovementStatus[] = ["OPEN", "IN_PROGRESS", "DONE"];

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
};

export default function ImprovementsPage() {
  const [items, setItems] = useState<Improvement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "FEATURE" as ImprovementType,
  });

  const byStatus = (s: ImprovementStatus) =>
    items.filter((i) => i.status === s);

  const handleFindAll = async () => {
    try {
      const response = await ImprovementService.findAll();
      setItems(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateImprovement = async () => {
    try {
      await ImprovementService.create(form);
      handleFindAll();
      setShowModal(false);
      setForm((prev) => ({
        ...prev,
        title: "",
        description: "",
      }));
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteImprovement = async (id: string) => {
    try {
      await ImprovementService.delete(id);
      handleFindAll();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeStatus = async (id: string, status: ImprovementStatus) => {
    try {
      await ImprovementService.updateStatus(id, status);
      handleFindAll();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFindAll();
  }, []);

  return (
    <main className="grid grid-cols-[auto_1fr] h-dvh max-w-6xl mx-auto bg-[#070714] text-slate-100 font-sans">
      <AppSidebar />

      <section className="overflow-y-auto flex flex-col">
        {/* Header */}
        <div
          className="sticky top-0 z-10 backdrop-blur-sm px-6 py-4 flex items-center justify-between"
          style={{
            background: "rgba(7,7,20,0.85)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div>
            <h1 className="text-xl font-bold text-slate-100">Melhorias</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {items.filter((i) => i.status === "OPEN").length} abertas ·{" "}
              {items.filter((i) => i.status === "IN_PROGRESS").length} em
              andamento · {items.filter((i) => i.status === "DONE").length}{" "}
              concluídas
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
            style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
            </svg>
            Nova solicitação
          </button>
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-3 gap-4 p-6 flex-1 min-h-0">
          {STATUSES.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const col = byStatus(status);
            return (
              <div key={status} className="flex flex-col gap-3">
                {/* Column header */}
                <div
                  className="flex items-center gap-2 pb-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={cfg.color}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {col.length}
                  </span>
                </div>

                {/* Cards */}
                {col.length === 0 && (
                  <div className="text-center py-10 text-slate-700 text-xs">
                    Nenhuma aqui
                  </div>
                )}
                {col.map((item) => {
                  const typeCfg = TYPE_CONFIG[item.type];
                  const nextStatuses = STATUSES.filter(
                    (s) => s !== item.status,
                  );
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl p-4 flex flex-col gap-3 group"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      {/* Type badge + delete */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={typeCfg.color}
                        >
                          {typeCfg.icon} {typeCfg.label}
                        </span>
                        <button
                          onClick={() => handleDeleteImprovement(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-full transition-all hover:bg-red-500/10 text-slate-600 hover:text-red-400"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-3.5 h-3.5 fill-current"
                          >
                            <path d="M6 7h12v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V7zm3 10h2V9H9v8zm4 0h2V9h-2v8zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                          </svg>
                        </button>
                      </div>

                      {/* Title + description */}
                      <div>
                        <p className="text-sm font-semibold text-slate-100 leading-snug">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Meta */}
                      <p className="text-xs text-slate-600">
                        {item.createdBy.name} ·{" "}
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </p>

                      {/* Move actions */}
                      <div className="flex gap-1 flex-wrap">
                        {nextStatuses.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleChangeStatus(item.id, s)}
                            className="text-xs px-2 py-1 rounded-full transition-all hover:opacity-80"
                            style={STATUS_CONFIG[s].color}
                          >
                            → {STATUS_CONFIG[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="absolute inset-0 flex items-center justify-center z-30"
          style={{
            background: "rgba(7,7,20,0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
            style={{
              background: "rgba(15,10,35,0.98)",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            <h2 className="text-lg font-bold text-slate-100 mb-6">
              Nova solicitação
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Tipo
                </label>
                <div className="flex gap-2">
                  {(["FEATURE", "BUG"] as ImprovementType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={
                        form.type === t
                          ? {
                              ...TYPE_CONFIG[t].color,
                              border: "1px solid transparent",
                            }
                          : { ...inputStyle, color: "#64748b" }
                      }
                    >
                      {TYPE_CONFIG[t].icon} {TYPE_CONFIG[t].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Descreva brevemente"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Descrição{" "}
                  <span className="normal-case text-slate-600">(opcional)</span>
                </label>
                <textarea
                  placeholder="Detalhes adicionais..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none resize-none"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
                style={{
                  background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
                }}
                onClick={() => {
                  handleCreateImprovement();
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
