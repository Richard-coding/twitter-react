import { useState } from "react";
import AppSidebar from "../components/AppSidebar";

type RsvpStatus = "GOING" | "NOT_GOING" | "MAYBE" | null;

interface Rsvp {
  name: string;
  status: RsvpStatus;
}

interface HouseEvent {
  id: number;
  title: string;
  description: string;
  startsAt: string; // ISO string
  endsAt?: string;
  location?: string;
  createdBy: string;
  rsvps: Rsvp[];
  myRsvp: RsvpStatus;
}

const INITIAL_EVENTS: HouseEvent[] = [
  {
    id: 1,
    title: "Churrasco do fim do mês",
    description: "Vamos comemorar março com um churrasco no quintal. Cada um traz algo!",
    startsAt: "2026-03-28T16:00:00",
    endsAt: "2026-03-28T22:00:00",
    location: "Quintal da casa",
    createdBy: "Carlos",
    myRsvp: "GOING",
    rsvps: [
      { name: "Ana",      status: "GOING" },
      { name: "Bernardo", status: "GOING" },
      { name: "Carlos",   status: "GOING" },
      { name: "Débora",   status: "MAYBE" },
      { name: "Eduardo",  status: "NOT_GOING" },
      { name: "Fernanda", status: "GOING" },
      { name: "Gustavo",  status: "MAYBE" },
    ],
  },
  {
    id: 2,
    title: "Reunião de contas",
    description: "Vamos fechar as contas de março e dividir as despesas do mês.",
    startsAt: "2026-03-25T20:00:00",
    location: "Sala de estar",
    createdBy: "Ana",
    myRsvp: null,
    rsvps: [
      { name: "Ana",      status: "GOING" },
      { name: "Bernardo", status: "GOING" },
      { name: "Carlos",   status: "MAYBE" },
      { name: "Débora",   status: "GOING" },
      { name: "Eduardo",  status: null },
      { name: "Fernanda", status: null },
      { name: "Gustavo",  status: "GOING" },
    ],
  },
  {
    id: 3,
    title: "Noite de filmes",
    description: "Vamos assistir ao filme mais votado da nossa lista! Pipoca por conta da casa.",
    startsAt: "2026-03-22T20:30:00",
    location: "Sala com projetor",
    createdBy: "Fernanda",
    myRsvp: "GOING",
    rsvps: [
      { name: "Ana",      status: "GOING" },
      { name: "Bernardo", status: "NOT_GOING" },
      { name: "Carlos",   status: "GOING" },
      { name: "Débora",   status: "GOING" },
      { name: "Eduardo",  status: "GOING" },
      { name: "Fernanda", status: "GOING" },
      { name: "Gustavo",  status: "MAYBE" },
    ],
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const RSVP_CONFIG: Record<NonNullable<RsvpStatus>, { label: string; activeStyle: React.CSSProperties; icon: string }> = {
  GOING:     { label: "Vou!",    icon: "✓", activeStyle: { background: "rgba(5,150,105,0.25)", border: "1px solid #059669", color: "#34d399" } },
  MAYBE:     { label: "Talvez", icon: "~", activeStyle: { background: "rgba(217,119,6,0.25)",  border: "1px solid #d97706", color: "#fbbf24" } },
  NOT_GOING: { label: "Não vou", icon: "✕", activeStyle: { background: "rgba(220,38,38,0.2)",  border: "1px solid #dc2626", color: "#f87171" } },
};

export default function EventsPage() {
  const [events, setEvents] = useState<HouseEvent[]>(INITIAL_EVENTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", startsAt: "", endsAt: "", location: "" });

  function setRsvp(eventId: number, status: NonNullable<RsvpStatus>) {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const newStatus: RsvpStatus = e.myRsvp === status ? null : status;
        return { ...e, myRsvp: newStatus };
      })
    );
  }

  function addEvent() {
    if (!form.title.trim() || !form.startsAt) return;
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: form.title,
        description: form.description,
        startsAt: form.startsAt,
        endsAt: form.endsAt || undefined,
        location: form.location || undefined,
        createdBy: "Você",
        myRsvp: null,
        rsvps: [],
      },
    ]);
    setForm({ title: "", description: "", startsAt: "", endsAt: "", location: "" });
    setShowModal(false);
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  const sorted = [...events].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

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
            <h1 className="text-xl font-bold text-slate-100">Eventos</h1>
            <p className="text-xs text-slate-500 mt-0.5">{events.length} próximos eventos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
            style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
            </svg>
            Criar evento
          </button>
        </div>

        {/* Events list */}
        <div className="flex flex-col gap-4 p-6">
          {sorted.map((event) => {
            const going   = event.rsvps.filter((r) => r.status === "GOING").length;
            const maybe   = event.rsvps.filter((r) => r.status === "MAYBE").length;
            const notGoing = event.rsvps.filter((r) => r.status === "NOT_GOING").length;

            return (
              <div
                key={event.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Top bar accent */}
                <div className="h-1" style={{ background: "linear-gradient(90deg, #6d28d9, #a21caf)" }} />

                <div className="p-5">
                  {/* Date badge + title */}
                  <div className="flex gap-4 mb-3">
                    <div
                      className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl shrink-0 text-center"
                      style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}
                    >
                      <span className="text-violet-300 font-bold text-xl leading-none">
                        {new Date(event.startsAt).getDate()}
                      </span>
                      <span className="text-violet-400 text-xs capitalize mt-0.5">
                        {new Date(event.startsAt).toLocaleString("pt-BR", { month: "short" })}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-100 mb-0.5">{event.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>
                          {formatDate(event.startsAt)} · {formatTime(event.startsAt)}
                          {event.endsAt && ` — ${formatTime(event.endsAt)}`}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{event.description}</p>
                  )}

                  {/* RSVP summary */}
                  <div className="flex gap-4 text-xs text-slate-500 mb-4">
                    <span className="text-emerald-400 font-semibold">{going} vão</span>
                    <span className="text-yellow-400 font-semibold">{maybe} talvez</span>
                    <span className="text-red-400 font-semibold">{notGoing} não vão</span>
                    <span className="ml-auto">Criado por {event.createdBy}</span>
                  </div>

                  {/* RSVP buttons */}
                  <div className="flex gap-2">
                    {(["GOING", "MAYBE", "NOT_GOING"] as const).map((status) => {
                      const cfg = RSVP_CONFIG[status];
                      const active = event.myRsvp === status;
                      return (
                        <button
                          key={status}
                          onClick={() => setRsvp(event.id, status)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                          style={
                            active
                              ? cfg.activeStyle
                              : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }
                          }
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal criar evento */}
      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center z-30"
             style={{ background: "rgba(7,7,20,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
               style={{ background: "rgba(15,10,35,0.98)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <h2 className="text-lg font-bold text-slate-100 mb-6">Criar evento</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Título</label>
                <input type="text" placeholder="Nome do evento" value={form.title}
                       onChange={(e) => setForm({ ...form, title: e.target.value })}
                       className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none" style={inputStyle} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Descrição</label>
                <textarea placeholder="Detalhes do evento..." value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none resize-none min-h-16" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Início</label>
                  <input type="datetime-local" value={form.startsAt}
                         onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                         className="rounded-xl px-4 py-3 text-sm text-slate-100 outline-none" style={inputStyle} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Término</label>
                  <input type="datetime-local" value={form.endsAt}
                         onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                         className="rounded-xl px-4 py-3 text-sm text-slate-100 outline-none" style={inputStyle} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Local</label>
                <input type="text" placeholder="Ex: Sala de estar, Quintal..." value={form.location}
                       onChange={(e) => setForm({ ...form, location: e.target.value })}
                       className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none" style={inputStyle} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                      onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
                      style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
                      onClick={addEvent}>
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
