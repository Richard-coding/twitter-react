import { useState } from "react";
import AppSidebar from "../components/AppSidebar";

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  description: string;
  suggestedBy: string;
  votes: number;
  userVoted: boolean;
  watchedAt?: string;
  rating?: number;
  ratingComment?: string;
}

const INITIAL_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Duna: Parte 2",
    year: 2024,
    genre: "Ficção Científica",
    description: "A continuação da épica jornada de Paul Atreides pelo deserto de Arrakis enquanto se une aos Fremen para enfrentar o Imperador.",
    suggestedBy: "Carlos",
    votes: 5,
    userVoted: true,
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    genre: "Drama",
    description: "A história do físico J. Robert Oppenheimer e seu papel crucial no Projeto Manhattan durante a Segunda Guerra Mundial.",
    suggestedBy: "Ana",
    votes: 4,
    userVoted: false,
  },
  {
    id: 3,
    title: "Poor Things",
    year: 2023,
    genre: "Fantasia",
    description: "Uma jovem ressuscitada por um excêntrico cientista foge com seu advogado e embarca em uma aventura pelo mundo.",
    suggestedBy: "Fernanda",
    votes: 3,
    userVoted: false,
  },
  {
    id: 4,
    title: "Past Lives",
    year: 2023,
    genre: "Romance",
    description: "Dois amigos de infância da Coreia se reencontram décadas depois em Nova York, confrontando o destino e as escolhas da vida.",
    suggestedBy: "Débora",
    votes: 2,
    userVoted: false,
  },
  {
    id: 5,
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: "Ação / Ficção",
    description: "Uma imigrante chinesa mergulha no multiverso para salvar o mundo enquanto lida com o IRS e os problemas da família.",
    suggestedBy: "Eduardo",
    votes: 6,
    userVoted: false,
    watchedAt: "2024-11-15",
    rating: 5,
    ratingComment: "Melhor filme que já vi! Uma montanha-russa de emoções.",
  },
  {
    id: 6,
    title: "The Zone of Interest",
    year: 2023,
    genre: "Drama",
    description: "A vida cotidiana do comandante de Auschwitz e sua família, que constroem sua vida ideal ao lado do campo de concentração.",
    suggestedBy: "Gustavo",
    votes: 3,
    userVoted: false,
    watchedAt: "2025-01-20",
    rating: 4,
    ratingComment: "Perturbador e brilhante. Silêncio que grita.",
  },
];

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => onChange?.(s)}
          className={`text-lg transition-colors ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"} ${s <= value ? "text-yellow-400" : "text-slate-700"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function GenreBadge({ genre }: { genre: string }) {
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: "rgba(124,58,237,0.2)", color: "#c084fc" }}
    >
      {genre}
    </span>
  );
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [tab, setTab] = useState<"towatch" | "watched">("towatch");
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState<Movie | null>(null);
  const [rateForm, setRateForm] = useState({ rating: 0, comment: "" });
  const [suggestForm, setSuggestForm] = useState({ title: "", year: "", genre: "", description: "" });

  const toWatch = movies.filter((m) => !m.watchedAt).sort((a, b) => b.votes - a.votes);
  const watched = movies.filter((m) => !!m.watchedAt);

  function toggleVote(id: number) {
    setMovies((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, userVoted: !m.userVoted, votes: m.userVoted ? m.votes - 1 : m.votes + 1 } : m
      )
    );
  }

  function markWatched(id: number) {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, watchedAt: new Date().toISOString().split("T")[0] } : m))
    );
  }

  function submitRating() {
    if (!showRateModal || rateForm.rating === 0) return;
    setMovies((prev) =>
      prev.map((m) =>
        m.id === showRateModal.id ? { ...m, rating: rateForm.rating, ratingComment: rateForm.comment } : m
      )
    );
    setShowRateModal(null);
    setRateForm({ rating: 0, comment: "" });
  }

  function addSuggestion() {
    if (!suggestForm.title.trim()) return;
    setMovies((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: suggestForm.title,
        year: parseInt(suggestForm.year) || new Date().getFullYear(),
        genre: suggestForm.genre || "Outro",
        description: suggestForm.description,
        suggestedBy: "Você",
        votes: 0,
        userVoted: false,
      },
    ]);
    setSuggestForm({ title: "", year: "", genre: "", description: "" });
    setShowSuggestModal(false);
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  const displayed = tab === "towatch" ? toWatch : watched;

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
            <h1 className="text-xl font-bold text-slate-100">Filmes</h1>
            <p className="text-xs text-slate-500 mt-0.5">{toWatch.length} para assistir · {watched.length} assistidos</p>
          </div>
          <button
            onClick={() => setShowSuggestModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
            style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
            </svg>
            Sugerir filme
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "16px" }}>
          {(["towatch", "watched"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                tab === t ? "text-white" : "text-slate-500 hover:text-slate-300"
              }`}
              style={tab === t ? { background: "linear-gradient(135deg, #6d28d9, #7c3aed)" } : {}}
            >
              {t === "towatch" ? `Para Assistir (${toWatch.length})` : `Assistidos (${watched.length})`}
            </button>
          ))}
        </div>

        {/* Movie list */}
        <div className="flex flex-col gap-3 p-6">
          {displayed.map((movie) => (
            <div
              key={movie.id}
              className="rounded-2xl p-5 transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-base font-bold text-slate-100">{movie.title}</h3>
                    <span className="text-slate-600 text-sm">{movie.year}</span>
                  </div>
                  <div className="mb-2">
                    <GenreBadge genre={movie.genre} />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">{movie.description}</p>
                  <p className="text-xs text-slate-600">Sugerido por <span className="text-slate-400">{movie.suggestedBy}</span></p>

                  {/* Rating (watched) */}
                  {movie.watchedAt && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {movie.rating ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <StarRating value={movie.rating} />
                            <span className="text-xs text-slate-500">avaliado em {new Date(movie.watchedAt).toLocaleDateString("pt-BR")}</span>
                          </div>
                          {movie.ratingComment && (
                            <p className="text-xs text-slate-400 italic">"{movie.ratingComment}"</p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowRateModal(movie)}
                          className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          + Avaliar este filme
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {!movie.watchedAt && (
                    <>
                      <button
                        onClick={() => toggleVote(movie.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                          movie.userVoted ? "text-violet-300" : "text-slate-400 hover:text-violet-400"
                        }`}
                        style={movie.userVoted ? { background: "rgba(124,58,237,0.2)" } : { background: "rgba(255,255,255,0.05)" }}
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                        </svg>
                        {movie.votes}
                      </button>
                      <button
                        onClick={() => markWatched(movie.id)}
                        className="text-xs font-semibold text-slate-500 hover:text-emerald-400 transition-colors"
                      >
                        Marcar como assistido
                      </button>
                    </>
                  )}
                  {movie.watchedAt && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: "rgba(5,150,105,0.15)", color: "#34d399" }}>
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      Assistido
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal avaliar */}
      {showRateModal && (
        <div className="absolute inset-0 flex items-center justify-center z-30"
             style={{ background: "rgba(7,7,20,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
               style={{ background: "rgba(15,10,35,0.98)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <h2 className="text-lg font-bold text-slate-100 mb-1">Avaliar filme</h2>
            <p className="text-sm text-slate-500 mb-6">{showRateModal.title}</p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-2">Nota</label>
                <StarRating value={rateForm.rating} onChange={(v) => setRateForm({ ...rateForm, rating: v })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Comentário (opcional)</label>
                <textarea
                  placeholder="O que você achou?"
                  value={rateForm.comment}
                  onChange={(e) => setRateForm({ ...rateForm, comment: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none resize-none min-h-20"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                      onClick={() => { setShowRateModal(null); setRateForm({ rating: 0, comment: "" }); }}>
                Cancelar
              </button>
              <button className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
                      style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
                      onClick={submitRating}>
                Salvar avaliação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sugerir */}
      {showSuggestModal && (
        <div className="absolute inset-0 flex items-center justify-center z-30"
             style={{ background: "rgba(7,7,20,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
               style={{ background: "rgba(15,10,35,0.98)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <h2 className="text-lg font-bold text-slate-100 mb-6">Sugerir filme</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Título</label>
                <input type="text" placeholder="Nome do filme" value={suggestForm.title}
                       onChange={(e) => setSuggestForm({ ...suggestForm, title: e.target.value })}
                       className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ano</label>
                  <input type="number" placeholder="2024" value={suggestForm.year}
                         onChange={(e) => setSuggestForm({ ...suggestForm, year: e.target.value })}
                         className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none" style={inputStyle} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Gênero</label>
                  <input type="text" placeholder="Drama, Ação..." value={suggestForm.genre}
                         onChange={(e) => setSuggestForm({ ...suggestForm, genre: e.target.value })}
                         className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none" style={inputStyle} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Descrição</label>
                <textarea placeholder="Fala um pouco sobre o filme..." value={suggestForm.description}
                          onChange={(e) => setSuggestForm({ ...suggestForm, description: e.target.value })}
                          className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none resize-none min-h-20" style={inputStyle} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                      onClick={() => setShowSuggestModal(false)}>
                Cancelar
              </button>
              <button className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
                      style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
                      onClick={addSuggestion}>
                Sugerir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
