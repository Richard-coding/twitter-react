import { useState } from "react";
import AppSidebar from "../components/AppSidebar";

type Category = "Alimentos" | "Limpeza" | "Higiene" | "Laticínios" | "Bebidas" | "Outro";
type Status = "PENDING" | "BOUGHT";

interface ShoppingItem {
  id: number;
  name: string;
  quantity: string;
  category: Category;
  status: Status;
  addedBy: string;
  boughtBy?: string;
}

const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  Alimentos:  { bg: "rgba(5,150,105,0.2)",  text: "#34d399" },
  Limpeza:    { bg: "rgba(37,99,235,0.2)",   text: "#60a5fa" },
  Higiene:    { bg: "rgba(147,51,234,0.2)",  text: "#c084fc" },
  Laticínios: { bg: "rgba(217,119,6,0.2)",   text: "#fbbf24" },
  Bebidas:    { bg: "rgba(220,38,38,0.2)",   text: "#f87171" },
  Outro:      { bg: "rgba(100,116,139,0.2)", text: "#94a3b8" },
};

const INITIAL_ITEMS: ShoppingItem[] = [
  { id: 1, name: "Arroz",              quantity: "5 kg",       category: "Alimentos",  status: "PENDING", addedBy: "Ana" },
  { id: 2, name: "Feijão",             quantity: "2 kg",       category: "Alimentos",  status: "PENDING", addedBy: "Carlos" },
  { id: 3, name: "Leite",              quantity: "6 caixas",   category: "Laticínios", status: "BOUGHT",  addedBy: "Fernanda", boughtBy: "Bernardo" },
  { id: 4, name: "Detergente",         quantity: "3 unid.",    category: "Limpeza",    status: "PENDING", addedBy: "Débora" },
  { id: 5, name: "Papel higiênico",    quantity: "2 pacotes",  category: "Higiene",    status: "BOUGHT",  addedBy: "Eduardo", boughtBy: "Gustavo" },
  { id: 6, name: "Azeite",             quantity: "1 garrafa",  category: "Alimentos",  status: "PENDING", addedBy: "Gustavo" },
  { id: 7, name: "Sabão em pó",        quantity: "1 caixa",    category: "Limpeza",    status: "PENDING", addedBy: "Ana" },
  { id: 8, name: "Suco de laranja",    quantity: "4 litros",   category: "Bebidas",    status: "PENDING", addedBy: "Carlos" },
  { id: 9, name: "Shampoo",            quantity: "2 unid.",    category: "Higiene",    status: "BOUGHT",  addedBy: "Fernanda", boughtBy: "Ana" },
];

const CATEGORIES: Category[] = ["Alimentos", "Laticínios", "Limpeza", "Higiene", "Bebidas", "Outro"];

const now = new Date();
const MONTH_LABEL = now.toLocaleString("pt-BR", { month: "long", year: "numeric" });

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL_ITEMS);
  const [tab, setTab] = useState<"pending" | "bought">("pending");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", quantity: "", category: "Alimentos" as Category });

  const filtered = items.filter((i) =>
    tab === "pending" ? i.status === "PENDING" : i.status === "BOUGHT"
  );

  const pendingCount = items.filter((i) => i.status === "PENDING").length;
  const boughtCount  = items.filter((i) => i.status === "BOUGHT").length;

  function toggleStatus(id: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "PENDING" ? "BOUGHT" : "PENDING", boughtBy: i.status === "PENDING" ? "Você" : undefined }
          : i
      )
    );
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function addItem() {
    if (!form.name.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: form.name, quantity: form.quantity, category: form.category, status: "PENDING", addedBy: "Você" },
    ]);
    setForm({ name: "", quantity: "", category: "Alimentos" });
    setShowModal(false);
  }

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
            <h1 className="text-xl font-bold text-slate-100">Lista de Compras</h1>
            <p className="text-xs text-slate-500 capitalize mt-0.5">{MONTH_LABEL}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
            style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
            </svg>
            Adicionar item
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>{boughtCount} de {items.length} comprados</span>
            <span>{Math.round((boughtCount / items.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(boughtCount / items.length) * 100}%`, background: "linear-gradient(90deg, #6d28d9, #a21caf)" }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-2">
          {(["pending", "bought"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                tab === t ? "text-white" : "text-slate-500 hover:text-slate-300"
              }`}
              style={tab === t ? { background: "linear-gradient(135deg, #6d28d9, #7c3aed)" } : {}}
            >
              {t === "pending" ? `Pendentes (${pendingCount})` : `Comprados (${boughtCount})`}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="flex flex-col gap-2 p-6">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-sm">{tab === "pending" ? "Nenhum item pendente!" : "Nenhum item comprado ainda."}</p>
            </div>
          )}
          {filtered.map((item) => {
            const cat = CATEGORY_COLORS[item.category];
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    item.status === "BOUGHT"
                      ? "border-violet-500 bg-violet-600"
                      : "border-slate-600 hover:border-violet-400"
                  }`}
                >
                  {item.status === "BOUGHT" && (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${item.status === "BOUGHT" ? "line-through text-slate-500" : "text-slate-100"}`}>
                    {item.name}
                    {item.quantity && <span className="text-slate-500 font-normal"> · {item.quantity}</span>}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Adicionado por {item.addedBy}
                    {item.boughtBy && ` · Comprado por ${item.boughtBy}`}
                  </p>
                </div>

                {/* Category badge */}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ background: cat.bg, color: cat.text }}>
                  {item.category}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full transition-all hover:bg-red-500/10 text-slate-600 hover:text-red-400"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M6 7h12v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V7zm3 10h2V9H9v8zm4 0h2V9h-2v8zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal adicionar item */}
      {showModal && (
        <div
          className="absolute inset-0 flex items-center justify-center z-30"
          style={{ background: "rgba(7,7,20,0.8)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
            style={{ background: "rgba(15,10,35,0.98)", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            <h2 className="text-lg font-bold text-slate-100 mb-6">Adicionar item</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nome do item</label>
                <input
                  type="text"
                  placeholder="Ex: Detergente"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quantidade</label>
                <input
                  type="text"
                  placeholder="Ex: 2 kg, 3 unid."
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Categoria</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                  className="rounded-xl px-4 py-3 text-sm text-slate-100 outline-none"
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
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
                style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
                onClick={addItem}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
