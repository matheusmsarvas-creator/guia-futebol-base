import { useEffect, useState } from "react";

type Row = { date: string; eventName: string; count: number };
type ApiResponse = {
  days: number;
  rows: Row[];
  totals: Record<string, number>;
  trackedEvents: string[];
  error?: string;
  hint?: string;
  missing?: string[];
  detail?: string;
};

const EVENT_LABELS: Record<string, string> = {
  click_download_ebook: "Download do e-book",
  click_listen_spotify: "Ouvir/baixar áudio (Spotify)",
  select_visitor_profile: "Perfil do visitante selecionado",
};

const EVENT_COLORS: Record<string, string> = {
  click_download_ebook: "#E8563F", // coral
  click_listen_spotify: "#2E5D8A", // navy
  select_visitor_profile: "#6FB1D9", // sky
};

function formatDate(yyyymmdd: string) {
  const d = `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function useAnalytics(token: string | null, days: number) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "unauthorized" | "error">("idle");

  useEffect(() => {
    if (!token) return;
    setStatus("loading");
    fetch(`/api/analytics?days=${days}`, { headers: { "x-dashboard-token": token } })
      .then(async (res) => {
        const json: ApiResponse = await res.json();
        if (res.status === 401) {
          setStatus("unauthorized");
          return;
        }
        if (!res.ok) {
          setData(json);
          setStatus("error");
          return;
        }
        setData(json);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [token, days]);

  return { data, status };
}

function LoginGate({ onSubmit }: { onSubmit: (token: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value.trim());
      }}
      className="mx-auto mt-24 max-w-sm rounded-2xl border border-line bg-white p-8 text-center shadow-sm"
    >
      <h1 className="font-display text-2xl font-extrabold text-navy">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Informe o token de acesso configurado no Vercel (DASHBOARD_TOKEN).</p>
      <input
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Token de acesso"
        className="mt-4 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-navy"
        autoFocus
      />
      <button type="submit" className="mt-3 w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-navy/90">
        Entrar
      </button>
    </form>
  );
}

function Chart({ rows, trackedEvents }: { rows: Row[]; trackedEvents: string[] }) {
  const dates = [...new Set(rows.map((r) => r.date))].sort();
  const max = Math.max(1, ...rows.map((r) => r.count));

  if (dates.length === 0) {
    return <p className="text-sm text-muted">Sem eventos registrados no período selecionado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-full items-end gap-3 pb-2" style={{ height: 220 }}>
        {dates.map((date) => (
          <div key={date} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-44 items-end gap-0.5">
              {trackedEvents.map((name) => {
                const count = rows.find((r) => r.date === date && r.eventName === name)?.count ?? 0;
                const height = Math.round((count / max) * 100);
                return (
                  <div
                    key={name}
                    title={`${EVENT_LABELS[name] ?? name}: ${count}`}
                    style={{ height: `${Math.max(height, count > 0 ? 3 : 0)}%`, width: 10, backgroundColor: EVENT_COLORS[name] ?? "#999" }}
                    className="rounded-t-sm"
                  />
                );
              })}
            </div>
            <span className="text-[10px] font-semibold text-muted">{formatDate(date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardApp() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("dashboard_token"));
  const [days, setDays] = useState(30);
  const { data, status } = useAnalytics(token, days);

  const handleLogin = (value: string) => {
    sessionStorage.setItem("dashboard_token", value);
    setToken(value);
  };

  if (!token) return <LoginGate onSubmit={handleLogin} />;

  if (status === "unauthorized") {
    return (
      <div className="mx-auto mt-24 max-w-sm text-center">
        <p className="font-bold text-coral-dark">Token inválido.</p>
        <button
          onClick={() => {
            sessionStorage.removeItem("dashboard_token");
            setToken(null);
          }}
          className="mt-3 text-sm font-semibold text-navy underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy">Eventos do Google Analytics</h1>
          <p className="mt-1 text-sm text-muted">Guia Alimentar para Famílias de Atletas de Futebol de Base</p>
        </div>
        <label className="text-sm font-semibold text-navy">
          Período:{" "}
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="ml-1 rounded-lg border border-line px-2 py-1">
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
          </select>
        </label>
      </div>

      {status === "loading" && <p className="mt-10 text-sm text-muted">Carregando dados da GA4 Data API…</p>}

      {(status === "error" || (data && "error" in data && data.error)) && (
        <div className="mt-10 rounded-xl border border-coral/30 bg-coral/5 p-6">
          <p className="font-bold text-coral-dark">Não foi possível carregar os dados.</p>
          <p className="mt-1 text-sm text-muted">{data?.error}</p>
          {data?.hint && <p className="mt-1 text-sm text-muted">{data.hint}</p>}
          {data?.missing && data.missing.length > 0 && (
            <p className="mt-1 text-sm text-muted">Variáveis faltando: {data.missing.join(", ")}</p>
          )}
          {data?.detail && (
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-navy/5 p-3 text-xs text-navy">{data.detail}</pre>
          )}
        </div>
      )}

      {status === "ok" && data && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {data.trackedEvents.map((name) => (
              <div key={name} className="rounded-xl border border-line bg-white p-5">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EVENT_COLORS[name] }} />
                <p className="mt-2 text-2xl font-extrabold text-navy">{data.totals[name] ?? 0}</p>
                <p className="text-sm text-muted">{EVENT_LABELS[name] ?? name}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-line bg-white p-6">
            <h2 className="font-bold text-navy">Eventos por dia</h2>
            <div className="mt-4 flex gap-4 text-xs text-muted">
              {data.trackedEvents.map((name) => (
                <span key={name} className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: EVENT_COLORS[name] }} />
                  {EVENT_LABELS[name] ?? name}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <Chart rows={data.rows} trackedEvents={data.trackedEvents} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
