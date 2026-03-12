import { useState } from "react";
import AppSidebar from "../components/AppSidebar";

type Frequency = "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

interface ChoreAssignment {
  id: number;
  choreName: string;
  frequency: Frequency;
  assignedTo: string;
  assignedBy: string;
  dueDate: string; // YYYY-MM-DD
  completedAt?: string;
  completedBy?: string;
}

const FREQ_LABELS: Record<Frequency, string> = {
  DAILY:    "Diária",
  WEEKLY:   "Semanal",
  BIWEEKLY: "Quinzenal",
  MONTHLY:  "Mensal",
};

const FREQ_COLORS: Record<Frequency, React.CSSProperties> = {
  DAILY:    { background: "rgba(220,38,38,0.15)",   color: "#f87171" },
  WEEKLY:   { background: "rgba(37,99,235,0.15)",   color: "#60a5fa" },
  BIWEEKLY: { background: "rgba(124,58,237,0.15)",  color: "#c084fc" },
  MONTHLY:  { background: "rgba(5,150,105,0.15)",   color: "#34d399" },
};

const MORADORES = ["Ana", "Bernardo", "Carlos", "Débora", "Eduardo", "Fernanda", "Gustavo"];

const INITIAL_ASSIGNMENTS: ChoreAssignment[] = [
  { id: 1, choreName: "Limpar banheiro",        frequency: "WEEKLY",   assignedTo: "Ana",      assignedBy: "Carlos",  dueDate: "2026-03-14" },
  { id: 2, choreName: "Lavar louça",             frequency: "DAILY",    assignedTo: "Bernardo", assignedBy: "Ana",     dueDate: "2026-03-12" },
  { id: 3, choreName: "Passar pano no corredor", frequency: "WEEKLY",   assignedTo: "Carlos",   assignedBy: "Fernanda", dueDate: "2026-03-15" },
  { id: 4, choreName: "Tirar o lixo",            frequency: "WEEKLY",   assignedTo: "Débora",   assignedBy: "Carlos",  dueDate: "2026-03-13" },
  { id: 5, choreName: "Limpar fogão",            frequency: "BIWEEKLY", assignedTo: "Eduardo",  assignedBy: "Ana",     dueDate: "2026-03-20" },
  { id: 6, choreName: "Organizar geladeira",     frequency: "MONTHLY",  assignedTo: "Fernanda", assignedBy: "Gustavo", dueDate: "2026-03-30" },
  { id: 7, choreName: "Varrer sala",             frequency: "WEEKLY",   assignedTo: "Gustavo",  assignedBy: "Débora",  dueDate: "2026-03-14",
    completedAt: "2026-03-13T10:30:00", completedBy: "Gustavo" },
  { id: 8, choreName: "Lavar roupa",             frequency: "BIWEEKLY", assignedTo: "Ana",      assignedBy: "Eduardo", dueDate: "2026-03-10",
    completedAt: "2026-03-10T14:00:00", completedBy: "Bernardo" },
];

function avatarGradient(name: string) {
  const gradients: Record<string, string> = {
    Ana:      "linear-gradient(135deg, #6d28d9, #a21caf)",
    Bernardo: "linear-gradient(135deg, #0369a1, #0891b2)",
    Carlos:   "linear-gradient(135deg, #065f46, #059669)",
    Débora:   "linear-gradient(135deg, #92400e, #d97706)",
    Eduardo:  "linear-gradient(135deg, #7f1d1d, #dc2626)",
    Fernanda: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
    Gustavo:  "linear-gradient(135deg, #3d1d7f, #8b5cf6)",
  };
  return gradients[name] ?? "linear-gradient(135deg, #6d28d9, #7c3aed)";
}

function isOverdue(dueDate: string, completedAt?: string) {
  if (completedAt) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function ChoresPage() {
  const [assignments, setAssignments] = useState<ChoreAssignment[]>(INITIAL_ASSIGNMENTS);
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const [filterUser, setFilterUser] = useState<string>("Todos");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ choreName: "", frequency: "WEEKLY" as Frequency, assignedTo: "Ana", dueDate: "" });

  function complete(id: number) {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, completedAt: new Date().toISOString(), completedBy: "Você" } : a
      )
    );
  }

  function uncomplete(id: number) {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completedAt: undefined, completedBy: undefined } : a))
    );
  }

  function removeAssignment(id: number) {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }

  function addAssignment() {
    if (!form.choreName.trim() || !form.dueDate) return;
    setAssignments((prev) => [
      ...prev,
      { id: Date.now(), choreName: form.choreName, frequency: form.frequency, assignedTo: form.assignedTo, assignedBy: "Você", dueDate: form.dueDate },
    ]);
    setForm({ choreName: "", frequency: "WEEKLY", assignedTo: "Ana", dueDate: "" });
    setShowModal(false);
  }

  const pending = assignments.filter((a) => !a.completedAt);
  const done    = assignments.filter((a) => !!a.completedAt);

  const displayed = (tab === "pending" ? pending : done).filter(
    (a) => filterUser === "Todos" || a.assignedTo === filterUser
  );

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <main className="grid grid-cols-[auto_1fr] h-dvh max-w-6xl mx-auto bg-[#070714] text-slate-100 font-sans">
      <AppSidebar />

      <section className="overflow-y-auto flex flex-col">
        {/* Header */}
        <div
          className="sticky top-0 z-10 backdrop-blur-sm px-6 py-4 flex items-center justify-between"
          style={{ background: "rgba(7,7,20,0.85)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <h1 className="text-xl font-bold text-slate-100">Tarefas</h1>
            <p className="text-xs text-slate-500 mt-0.5">{pending.length} pendentes · {done.length} concluídas</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
            style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
            </svg>
            Atribuir tarefa
          </button>
        </div>

        {/* Tabs + filter */}
        <div className="flex items-center justify-between px-6 pt-4 pb-4 gap-4"
             style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex gap-2">
            {(["pending", "done"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  tab === t ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
                style={tab === t ? { background: "linear-gradient(135deg, #6d28d9, #7c3aed)" } : {}}
              >
                {t === "pending" ? `Pendentes (${pending.length})` : `Concluídas (${done.length})`}
              </button>
            ))}
          </div>

          {/* Filter by person */}
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="rounded-full px-3 py-1.5 text-xs text-slate-300 outline-none"
            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
          >
            <option value="Todos">Todos</option>
            {MORADORES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Assignments */}
        <div className="flex flex-col gap-2 p-6">
          {displayed.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-sm">
                {tab === "pending" ? "Nenhuma tarefa pendente!" : "Nenhuma tarefa concluída ainda."}
              </p>
            </div>
          )}

          {displayed.map((a) => {
            const overdue = isOverdue(a.dueDate, a.completedAt);
            return (
              <div
                key={a.id}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group"
                style={{
                  background: overdue ? "rgba(220,38,38,0.05)" : "rgba(255,255,255,0.03)",
                  border: overdue ? "1px solid rgba(220,38,38,0.2)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: avatarGradient(a.assignedTo) }}
                >
                  {a.assignedTo.slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${a.completedAt ? "line-through text-slate-500" : "text-slate-100"}`}>
                      {a.choreName}
                    </p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={FREQ_COLORS[a.frequency]}>
                      {FREQ_LABELS[a.frequency]}
                    </span>
                    {overdue && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(220,38,38,0.2)", color: "#f87171" }}>
                        Atrasada
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {a.assignedTo} · Vence em {new Date(a.dueDate).toLocaleDateString("pt-BR")}
                    {a.completedAt && a.completedBy && ` · Concluída por ${a.completedBy}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!a.completedAt ? (
                    <button
                      onClick={() => complete(a.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all text-emerald-400 hover:text-emerald-300"
                      style={{ background: "rgba(5,150,105,0.12)", border: "1px solid rgba(5,150,105,0.2)" }}
                    >
                      Concluir
                    </button>
                  ) : (
                    <button
                      onClick={() => uncomplete(a.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all text-slate-500 hover:text-slate-300"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      Desfazer
                    </button>
                  )}
                  <button
                    onClick={() => removeAssignment(a.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full transition-all hover:bg-red-500/10 text-slate-600 hover:text-red-400"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M6 7h12v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V7zm3 10h2V9H9v8zm4 0h2V9h-2v8zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal atribuir tarefa */}
      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center z-30"
             style={{ background: "rgba(7,7,20,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
               style={{ background: "rgba(15,10,35,0.98)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <h2 className="text-lg font-bold text-slate-100 mb-6">Atribuir tarefa</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tarefa</label>
                <input type="text" placeholder="Ex: Limpar banheiro" value={form.choreName}
                       onChange={(e) => setForm({ ...form, choreName: e.target.value })}
                       className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none" style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Responsável</label>
                  <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                          className="rounded-xl px-4 py-3 text-sm text-slate-100 outline-none" style={{ ...inputStyle, appearance: "none" }}>
                    {MORADORES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Frequência</label>
                  <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as Frequency })}
                          className="rounded-xl px-4 py-3 text-sm text-slate-100 outline-none" style={{ ...inputStyle, appearance: "none" }}>
                    {Object.entries(FREQ_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Data de vencimento</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                       className="rounded-xl px-4 py-3 text-sm text-slate-100 outline-none" style={inputStyle} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                      onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
                      style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
                      onClick={addAssignment}>
                Atribuir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
