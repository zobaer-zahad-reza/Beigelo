import { useState, useEffect, useCallback, useRef } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ─── STYLE ─────────────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:      #F5F4F1;
      --surface: #FFFFFF;
      --border:  #E6E3DC;
      --text1:   #1A1816;
      --text2:   #5C5752;
      --text3:   #9C9690;
      --red:     #C84B2F;
      --blue:    #2156C8;
      --green:   #1A7A52;
      --purple:  #6B30B8;
      --amber:   #C07B18;
    }
    body { background: var(--bg); font-family: 'Inter', sans-serif; }

    @keyframes fadeUp {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }

    .fade-up { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
    .fade-1 { animation-delay: .04s }
    .fade-2 { animation-delay: .08s }
    .fade-3 { animation-delay: .12s }
    .fade-4 { animation-delay: .16s }
    .fade-5 { animation-delay: .20s }
    .fade-6 { animation-delay: .24s }

    .spin { animation: spin .9s linear infinite; }
    .live-dot { animation: pulse 2s ease-in-out infinite; }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      transition: box-shadow .2s;
    }
    .card:hover { box-shadow: 0 2px 12px rgba(0,0,0,.06); }

    .tab-btn {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 7px 16px;
      border-radius: 9px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--text3);
      transition: all .15s;
      white-space: nowrap;
    }
    .tab-btn.active { background: var(--text1); color: #fff; }
    .tab-btn:not(.active):hover { background: var(--border); color: var(--text2); }

    .btn {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 7px 14px;
      border-radius: 9px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text2);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all .15s;
    }
    .btn:hover { background: var(--bg); }
    .btn:active { transform: scale(.97); }
    .btn:disabled { opacity: .45; cursor: not-allowed; }
    .btn-primary { background: var(--text1); color: #fff; border-color: var(--text1); }
    .btn-primary:hover { background: #2d2925; }
    .btn-danger { color: #b91c1c; border-color: #fca5a5; background: transparent; }
    .btn-danger:hover { background: #fef2f2; }
    .btn-demo { color: var(--purple); border-color: #c4b5fd; background: #faf5ff; }
    .btn-demo.active { background: var(--purple); color: #fff; border-color: var(--purple); }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 20px;
    }
    .badge-blue   { background: #eff6ff; color: #1d4ed8; }
    .badge-amber  { background: #fffbeb; color: #92400e; }
    .badge-slate  { background: #f1f5f9; color: #475569; }
    .badge-green  { background: #ecfdf5; color: #065f46; }
    .badge-red    { background: #fef2f2; color: #991b1b; }
    .badge-purple { background: #faf5ff; color: #6b21a8; }

    .search-input {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      border: 1px solid var(--border);
      border-radius: 9px;
      padding: 7px 12px 7px 32px;
      outline: none;
      background: var(--bg);
      color: var(--text1);
      transition: border-color .15s, box-shadow .15s;
      width: 240px;
    }
    .search-input:focus {
      border-color: var(--red);
      box-shadow: 0 0 0 3px rgba(200,75,47,.08);
    }
    .search-input::placeholder { color: var(--text3); }

    .progress-bar {
      height: 5px;
      border-radius: 99px;
      background: var(--border);
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 99px;
      transition: width .4s ease;
    }

    .tr:hover td { background: #fafaf8; }
    .tr td { transition: background .1s; }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(0,0,0,.35);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal {
      background: var(--surface);
      border-radius: 18px;
      padding: 28px;
      max-width: 360px;
      width: calc(100% - 32px);
      border: 1px solid var(--border);
      box-shadow: 0 20px 60px rgba(0,0,0,.15);
    }

    .tooltip-box {
      background: var(--text1) !important;
      border: none !important;
      border-radius: 9px !important;
      padding: 7px 12px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 12px !important;
      color: #fff !important;
    }

    @media (max-width: 900px) {
      .three-col { grid-template-columns: 1fr !important; }
      .two-col   { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const BACKEND = "http://localhost:4000/api/visitors";
const COLORS = [
  "#C84B2F",
  "#2156C8",
  "#1A7A52",
  "#6B30B8",
  "#C07B18",
  "#C02680",
];
const PER_PAGE = 12;

/* ─── MOCK DATA GENERATOR ────────────────────────────────────────────────── */
const SOURCES = [
  "Google",
  "Facebook",
  "Instagram",
  "Direct",
  "LinkedIn",
  "Bing",
  "YouTube",
];
const COUNTRIES = [
  "Bangladesh",
  "India",
  "USA",
  "UK",
  "Canada",
  "Germany",
  "Australia",
  "Japan",
  "Brazil",
  "France",
];
const PAGES = [
  "/home",
  "/products",
  "/about",
  "/contact",
  "/blog",
  "/pricing",
  "/demo",
  "/signup",
];
const UAS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17) Safari/604",
  "Mozilla/5.0 (iPad; CPU OS 16) Safari/604",
  "Mozilla/5.0 (Linux; Android 13) Chrome/120",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/537",
];
const FAKE_IPS = Array.from(
  { length: 30 },
  (_, i) => `192.168.${Math.floor(i / 10)}.${(i % 10) + 1}`,
);

function generateMockData() {
  const now = Date.now();
  return Array.from({ length: 120 }, (_, i) => {
    const daysAgo = Math.floor(Math.random() * 14);
    const hoursAgo = Math.floor(Math.random() * 24);
    const ts = new Date(
      now - daysAgo * 86400000 - hoursAgo * 3600000,
    ).toISOString();
    return {
      _id: `mock_${i}`,
      ip: FAKE_IPS[i % FAKE_IPS.length],
      page: PAGES[i % PAGES.length],
      source: SOURCES[i % SOURCES.length],
      country: COUNTRIES[i % COUNTRIES.length],
      userAgent: UAS[i % UAS.length],
      createdAt: ts,
    };
  });
}

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const fmtDate = (str) => {
  if (!str) return "—";
  return new Date(str).toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const getDevice = (ua = "") => {
  const u = ua.toLowerCase();
  if (/ipad|tablet/.test(u)) return "Tablet";
  if (/mobile|android|iphone/.test(u)) return "Mobile";
  return "Desktop";
};
const rnd = (n) => Math.round(n);

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-box">
      <p style={{ color: "#888", fontSize: 11, marginBottom: 3 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontWeight: 700 }}>
          {p.value} {p.name}
        </p>
      ))}
    </div>
  );
};

/* ─── STAT CARD ──────────────────────────────────────────────────────────── */
const StatCard = ({ title, value, sub, icon, color, delay }) => (
  <div
    className={`card fade-up fade-${delay}`}
    style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 4,
        height: "100%",
        background: color,
        borderRadius: "14px 0 0 14px",
      }}
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--text3)",
          textTransform: "uppercase",
          letterSpacing: ".07em",
        }}
      >
        {title}
      </span>
      <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
    </div>
    <p
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 36,
        fontWeight: 500,
        color: "var(--text1)",
        lineHeight: 1,
        marginBottom: 5,
      }}
    >
      {value ?? "—"}
    </p>
    {sub && <p style={{ fontSize: 12, color: "var(--text3)" }}>{sub}</p>}
  </div>
);

/* ─── SECTION HEADER ─────────────────────────────────────────────────────── */
const SecHead = ({ title, right }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    }}
  >
    <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text1)" }}>
      {title}
    </h3>
    {right}
  </div>
);

/* ─── SVG ICONS ──────────────────────────────────────────────────────────── */
const Ico = {
  refresh: (cls) => (
    <svg
      className={cls}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h5M20 20v-5h-5M4.09 9A8 8 0 0118 7.8M19.91 15A8 8 0 016 16.2"
      />
    </svg>
  ),
  eye: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  trash: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="3 6 5 6 21 6" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"
      />
    </svg>
  ),
  search: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  spark: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      />
    </svg>
  ),
  x: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const SourceIcons = {
  Google: "🔍",
  Facebook: "👥",
  Instagram: "📸",
  YouTube: "▶️",
  LinkedIn: "💼",
  Direct: "🎯",
  Bing: "🔎",
  Twitter: "🐦",
};
const DeviceIcons = { Desktop: "🖥", Mobile: "📱", Tablet: "📟" };

/* ══════════════════════════════════════════════════════════════════════════ */
export default function VisitorAnalytics() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [trackMsg, setTrackMsg] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("overview");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const timerRef = useRef(null);

  /* ── fetch ── */
  const fetchVisitors = useCallback(async () => {
    if (demoMode) {
      setVisitors(generateMockData());
      setLoading(false);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/all`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      setVisitors(Array.isArray(data) ? data : (data.visitors ?? []));
      setError(null);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [demoMode]);

  useEffect(() => {
    fetchVisitors();
    timerRef.current = setInterval(fetchVisitors, 30000);
    return () => clearInterval(timerRef.current);
  }, [fetchVisitors]);

  /* ── demo toggle ── */
  const toggleDemo = () => {
    setDemoMode((v) => !v);
    setSearch("");
    setPage(1);
    setTab("overview");
  };

  /* ── track ── */
  const handleTrack = async () => {
    if (demoMode) {
      setTrackMsg({ type: "success", text: "(Demo) Visit recorded!" });
      setVisitors((v) => [generateMockData()[0], ...v]);
      setTimeout(() => setTrackMsg(null), 3000);
      return;
    }
    setTracking(true);
    try {
      const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
      );
      const res = await fetch(`${BACKEND}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: typeof window !== "undefined" ? window.location.pathname : "/",
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
          referrer:
            typeof document !== "undefined"
              ? document.referrer || "direct"
              : "direct",
          utm_source: params.get("utm_source") || undefined,
          utm_medium: params.get("utm_medium") || undefined,
          utm_campaign: params.get("utm_campaign") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setTrackMsg({ type: "success", text: data.message || "Tracked!" });
      fetchVisitors();
    } catch (e) {
      setTrackMsg({ type: "error", text: e.message });
    } finally {
      setTracking(false);
      setTimeout(() => setTrackMsg(null), 3500);
    }
  };

  /* ── delete ── */
  const handleDelete = async (id) => {
    if (demoMode) {
      setVisitors((v) => v.filter((x) => x._id !== id));
      return;
    }
    setDeletingId(id);
    try {
      await fetch(`${BACKEND}/${id}`, { method: "DELETE" });
      setVisitors((v) => v.filter((x) => x._id !== id));
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    setConfirmClear(false);
    if (demoMode) {
      setVisitors([]);
      return;
    }
    try {
      await fetch(`${BACKEND}/all`, { method: "DELETE" });
      setVisitors([]);
    } catch {
      alert("Delete all failed");
    }
  };

  /* ── derived stats ── */
  const total = visitors.length;
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayCount = visitors.filter(
    (v) => (v.createdAt || v.timestamp || "").slice(0, 10) === todayKey,
  ).length;
  const uniqueIPs = new Set(visitors.map((v) => v.ip || v.ipAddress)).size;

  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visits: visitors.filter(
        (v) => (v.createdAt || v.timestamp || "").slice(0, 10) === key,
      ).length,
    };
  });

  const hourly = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, "0")}h`,
    visits: visitors.filter((v) => {
      const d = new Date(v.createdAt || v.timestamp || 0);
      return d.toISOString().slice(0, 10) === todayKey && d.getHours() === h;
    }).length,
  }));

  const countByKey = (arr, key) =>
    arr.reduce((a, v) => {
      const k = v[key] || "Unknown";
      a[k] = (a[k] || 0) + 1;
      return a;
    }, {});

  const pageCounts = countByKey(visitors, "page");
  const sourceCounts = countByKey(visitors, "source");
  const countryCounts = countByKey(visitors, "country");

  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([p, c]) => ({
      page: p.length > 28 ? p.slice(0, 28) + "…" : p,
      count: c,
    }));

  const sourceData = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const deviceCounts = visitors.reduce((a, v) => {
    const d = getDevice(v.userAgent);
    a[d] = (a[d] || 0) + 1;
    return a;
  }, {});

  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const peakVisits = Math.max(...last14.map((d) => d.visits), 1);
  const avgDaily = total > 0 ? rnd(total / 14) : 0;

  /* ── filtered + paginated ── */
  const filtered = visitors.filter((v) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (v.ip || "").includes(q) ||
      (v.page || "").toLowerCase().includes(q) ||
      (v.country || "").toLowerCase().includes(q) ||
      (v.source || "").toLowerCase().includes(q)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE,
  );

  /* ── pagination buttons ── */
  const buildPages = () => {
    const btns = [];
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) btns.push(i);
    return btns;
  };

  /* ── render ── */
  return (
    <>
      <GlobalStyle />
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          padding: "28px 20px",
          fontFamily: "'Inter',sans-serif",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* ══ HEADER ══ */}
          <div
            className="fade-up"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: "var(--text1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                📡
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 24,
                    fontWeight: 500,
                    color: "var(--text1)",
                    lineHeight: 1.1,
                  }}
                >
                  Visitor Analytics
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 3,
                  }}
                >
                  <span
                    className="live-dot"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#22c55e",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text3)",
                    }}
                  >
                    Live — auto-refreshes every 30s
                  </span>
                  {demoMode && (
                    <span
                      className="badge badge-purple"
                      style={{ marginLeft: 4 }}
                    >
                      DEMO MODE
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
              }}
            >
              {trackMsg && (
                <span
                  className={`badge ${trackMsg.type === "success" ? "badge-green" : "badge-red"}`}
                  style={{ fontSize: 12, padding: "4px 10px" }}
                >
                  {trackMsg.type === "success" ? "✓" : "✗"} {trackMsg.text}
                </span>
              )}
              <button
                className={`btn btn-demo${demoMode ? " active" : ""}`}
                onClick={toggleDemo}
              >
                {Ico.spark()} {demoMode ? "Exit Demo" : "Demo Mode"}
              </button>
              <button
                className="btn"
                onClick={fetchVisitors}
                disabled={loading}
              >
                {Ico.refresh(loading ? "spin" : "")} Refresh
              </button>
              <button
                className="btn btn-primary"
                onClick={handleTrack}
                disabled={tracking}
              >
                {tracking ? (
                  <span
                    className="spin"
                    style={{
                      width: 12,
                      height: 12,
                      border: "2px solid rgba(255,255,255,.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                ) : (
                  Ico.eye()
                )}
                {tracking ? "Tracking…" : "Track Visit"}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setConfirmClear(true)}
              >
                {Ico.trash()} Clear All
              </button>
            </div>
          </div>

          {/* error banner */}
          {error && !demoMode && (
            <div
              className="fade-up"
              style={{
                marginBottom: 18,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                borderRadius: 10,
                padding: "11px 15px",
                fontSize: 13,
              }}
            >
              ⚠ Backend unreachable: <strong>{error}</strong> — enable{" "}
              <button
                onClick={toggleDemo}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b30b8",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Demo Mode
              </button>{" "}
              to preview.
            </div>
          )}

          {/* ══ CONFIRM MODAL ══ */}
          {confirmClear && (
            <div
              className="modal-backdrop"
              onClick={() => setConfirmClear(false)}
            >
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <p
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 22,
                    color: "var(--text1)",
                    marginBottom: 8,
                  }}
                >
                  Delete all visitors?
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text2)",
                    lineHeight: 1.6,
                    marginBottom: 22,
                  }}
                >
                  This will permanently remove all{" "}
                  <strong>{total.toLocaleString()}</strong> records. This cannot
                  be undone.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      padding: "9px 0",
                      borderRadius: 9,
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      fontFamily: "'Inter'",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Delete All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ STAT CARDS ══ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <StatCard
              title="Total Visits"
              value={total.toLocaleString()}
              icon="👥"
              sub="All time"
              color="var(--red)"
              delay={1}
            />
            <StatCard
              title="Today"
              value={todayCount}
              icon="📅"
              sub={new Date().toLocaleDateString("en-BD", {
                day: "2-digit",
                month: "long",
              })}
              color="var(--blue)"
              delay={2}
            />
            <StatCard
              title="Unique IPs"
              value={uniqueIPs.toLocaleString()}
              icon="🌐"
              sub="Distinct addresses"
              color="var(--green)"
              delay={3}
            />
            <StatCard
              title="Countries"
              value={Object.keys(countryCounts).length}
              icon="🗺"
              sub="Unique locations"
              color="var(--purple)"
              delay={4}
            />
            <StatCard
              title="Avg / Day"
              value={avgDaily}
              icon="📊"
              sub="Last 14 days"
              color="var(--amber)"
              delay={5}
            />
            <StatCard
              title="Peak Day"
              value={peakVisits}
              icon="🏆"
              sub="Best single day"
              color="var(--red)"
              delay={6}
            />
          </div>

          {/* ══ TABS ══ */}
          <div
            className="fade-up fade-5"
            style={{
              display: "flex",
              gap: 5,
              marginBottom: 20,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 4,
              width: "fit-content",
            }}
          >
            {[
              ["overview", "📈 Overview"],
              ["table", "📋 All Visitors"],
            ].map(([k, l]) => (
              <button
                key={k}
                className={`tab-btn${tab === k ? " active" : ""}`}
                onClick={() => {
                  setTab(k);
                  setPage(1);
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <>
              {/* 14-day area */}
              <div
                className="card fade-up fade-5"
                style={{ padding: 22, marginBottom: 16 }}
              >
                <SecHead
                  title="Visits — Last 14 Days"
                  right={
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text3)",
                        fontWeight: 600,
                      }}
                    >
                      Peak: {peakVisits} · Avg: {avgDaily}/day
                    </span>
                  }
                />
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart
                    data={last14}
                    margin={{ top: 5, right: 5, bottom: 0, left: -15 }}
                  >
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#C84B2F"
                          stopOpacity={0.12}
                        />
                        <stop
                          offset="95%"
                          stopColor="#C84B2F"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE7" />
                    <XAxis
                      dataKey="day"
                      tick={{
                        fontSize: 11,
                        fill: "#9C9690",
                        fontFamily: "Inter",
                      }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                        fill: "#9C9690",
                        fontFamily: "Inter",
                      }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="#C84B2F"
                      strokeWidth={2.5}
                      fill="url(#areaGrad)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: "#C84B2F",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* hourly bar */}
              <div
                className="card fade-up fade-5"
                style={{ padding: 22, marginBottom: 16 }}
              >
                <SecHead title="Today — Hourly Breakdown" />
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart
                    data={hourly}
                    margin={{ top: 4, right: 5, bottom: 0, left: -15 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#F0EDE7"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 10, fill: "#9C9690" }}
                      interval={3}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 10, fill: "#9C9690" }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="visits"
                      fill="#2156C8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 3-col */}
              <div
                className="three-col"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                {/* top pages */}
                <div className="card" style={{ padding: 22 }}>
                  <SecHead title="Top Pages" />
                  {topPages.length === 0 ? (
                    <p
                      style={{
                        color: "var(--text3)",
                        fontSize: 13,
                        padding: "20px 0",
                        textAlign: "center",
                      }}
                    >
                      No data
                    </p>
                  ) : (
                    topPages.map((p, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 5,
                            fontSize: 12,
                          }}
                        >
                          <span
                            style={{
                              color: "var(--text2)",
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 150,
                            }}
                          >
                            {p.page}
                          </span>
                          <span
                            style={{
                              fontWeight: 800,
                              color: "var(--text1)",
                              flexShrink: 0,
                              marginLeft: 8,
                            }}
                          >
                            {p.count}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${rnd((p.count / topPages[0].count) * 100)}%`,
                              background: COLORS[i % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* traffic source — donut */}
                <div className="card" style={{ padding: 22 }}>
                  <SecHead title="Traffic Source" />
                  {sourceData.length === 0 ? (
                    <p
                      style={{
                        color: "var(--text3)",
                        fontSize: 13,
                        padding: "20px 0",
                        textAlign: "center",
                      }}
                    >
                      No data
                    </p>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={130}>
                        <PieChart>
                          <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={58}
                            paddingAngle={3}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                          >
                            {sourceData.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          marginTop: 8,
                        }}
                      >
                        {sourceData.slice(0, 4).map((s, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: 12,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 7,
                              }}
                            >
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: COLORS[i % COLORS.length],
                                  display: "inline-block",
                                  flexShrink: 0,
                                }}
                              />
                              <span
                                style={{
                                  color: "var(--text2)",
                                  fontWeight: 500,
                                }}
                              >
                                {SourceIcons[s.name] || "🌐"} {s.name}
                              </span>
                            </div>
                            <span
                              style={{ fontWeight: 800, color: "var(--text1)" }}
                            >
                              {s.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* device + countries */}
                <div className="card" style={{ padding: 22 }}>
                  <SecHead title="Device Type" />
                  {Object.entries(deviceCounts).length === 0 ? (
                    <p style={{ color: "var(--text3)", fontSize: 13 }}>
                      No data
                    </p>
                  ) : (
                    Object.entries(deviceCounts).map(([d, cnt], i) => (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                            marginBottom: 5,
                            fontWeight: 600,
                            color: "var(--text2)",
                          }}
                        >
                          <span>
                            {DeviceIcons[d] || "💻"} {d}
                          </span>
                          <span
                            style={{ color: "var(--text1)", fontWeight: 800 }}
                          >
                            {total ? rnd((cnt / total) * 100) : 0}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${total ? rnd((cnt / total) * 100) : 0}%`,
                              background: COLORS[i],
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                  <div
                    style={{
                      borderTop: "1px solid var(--border)",
                      paddingTop: 18,
                      marginTop: 18,
                    }}
                  >
                    <SecHead title="Top Countries" />
                    {topCountries.length === 0 ? (
                      <p style={{ color: "var(--text3)", fontSize: 12 }}>
                        No data
                      </p>
                    ) : (
                      topCountries.slice(0, 5).map((c, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: 12,
                            marginBottom: 9,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                background: COLORS[i % COLORS.length] + "22",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 800,
                                color: COLORS[i % COLORS.length],
                              }}
                            >
                              {i + 1}
                            </span>
                            <span
                              style={{ color: "var(--text2)", fontWeight: 600 }}
                            >
                              {c.name}
                            </span>
                          </div>
                          <span
                            style={{ fontWeight: 800, color: "var(--text1)" }}
                          >
                            {c.value}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ TABLE TAB ══ */}
          {tab === "table" && (
            <div className="card fade-up" style={{ overflow: "hidden" }}>
              {/* toolbar */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h2
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text1)",
                    }}
                  >
                    All Visitors
                  </h2>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 20,
                      padding: "2px 9px",
                      color: "var(--text2)",
                    }}
                  >
                    {filtered.length}
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text3)",
                    }}
                  >
                    {Ico.search()}
                  </span>
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search IP, page, country…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "60px 0",
                  }}
                >
                  <div
                    className="spin"
                    style={{
                      width: 32,
                      height: 32,
                      border: "3px solid var(--border)",
                      borderTopColor: "var(--red)",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              ) : paginated.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "var(--text3)",
                    fontSize: 14,
                  }}
                >
                  {visitors.length === 0
                    ? "No visitor data yet. Track a visit or enable Demo Mode."
                    : "Nothing matches your search."}
                </div>
              ) : (
                <>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 12,
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: "var(--bg)",
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          {[
                            "#",
                            "IP Address",
                            "Page / URL",
                            "Country",
                            "Source",
                            "Device",
                            "Time",
                            "",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                textAlign: "left",
                                padding: "9px 18px",
                                fontSize: 10,
                                fontWeight: 700,
                                color: "var(--text3)",
                                textTransform: "uppercase",
                                letterSpacing: ".07em",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((v, i) => {
                          const device = getDevice(v.userAgent);
                          const idx = (safePage - 1) * PER_PAGE + i + 1;
                          return (
                            <tr
                              key={v._id || i}
                              className="tr"
                              style={{
                                borderBottom: "1px solid var(--border)",
                              }}
                            >
                              <td
                                style={{
                                  padding: "12px 18px",
                                  color: "var(--text3)",
                                  fontWeight: 600,
                                }}
                              >
                                {idx}
                              </td>
                              <td
                                style={{
                                  padding: "12px 18px",
                                  fontFamily: "monospace",
                                  fontSize: 12,
                                  color: "var(--text2)",
                                  fontWeight: 600,
                                }}
                              >
                                {v.ip || v.ipAddress || "—"}
                              </td>
                              <td
                                style={{ padding: "12px 18px", maxWidth: 160 }}
                              >
                                <span
                                  style={{
                                    color: "var(--red)",
                                    fontWeight: 600,
                                    display: "block",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {v.page || v.url || "/"}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "12px 18px",
                                  color: "var(--text2)",
                                  fontWeight: 500,
                                }}
                              >
                                {v.country || "—"}
                              </td>
                              <td style={{ padding: "12px 18px" }}>
                                <span className="badge badge-blue">
                                  {SourceIcons[v.source || "Direct"] || "🌐"}{" "}
                                  {v.source || "Direct"}
                                </span>
                              </td>
                              <td style={{ padding: "12px 18px" }}>
                                <span
                                  className={`badge ${{ Desktop: "badge-slate", Mobile: "badge-amber", Tablet: "badge-green" }[device]}`}
                                >
                                  {DeviceIcons[device] || "💻"} {device}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "12px 18px",
                                  color: "var(--text3)",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {fmtDate(v.createdAt || v.timestamp)}
                              </td>
                              <td style={{ padding: "12px 18px" }}>
                                <button
                                  onClick={() => handleDelete(v._id)}
                                  disabled={deletingId === v._id}
                                  title="Delete record"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#fca5a5",
                                    padding: 4,
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "color .15s",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = "#dc2626")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.color = "#fca5a5")
                                  }
                                >
                                  {deletingId === v._id ? "…" : Ico.x()}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* pagination */}
                  {totalPages > 1 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        padding: "12px 20px",
                        borderTop: "1px solid var(--border)",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: "var(--text3)", fontWeight: 500 }}>
                        {(safePage - 1) * PER_PAGE + 1}–
                        {Math.min(safePage * PER_PAGE, filtered.length)} of{" "}
                        {filtered.length}
                      </span>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[
                          {
                            label: "‹",
                            fn: () => setPage((p) => Math.max(1, p - 1)),
                            dis: safePage === 1,
                          },
                          ...buildPages().map((n) => ({
                            label: n,
                            fn: () => setPage(n),
                            dis: false,
                            active: safePage === n,
                          })),
                          {
                            label: "›",
                            fn: () =>
                              setPage((p) => Math.min(totalPages, p + 1)),
                            dis: safePage === totalPages,
                          },
                        ].map((b, i) => (
                          <button
                            key={i}
                            onClick={b.fn}
                            disabled={b.dis}
                            style={{
                              minWidth: 30,
                              height: 30,
                              borderRadius: 7,
                              border: `1px solid ${b.active ? "transparent" : "var(--border)"}`,
                              background: b.active
                                ? "var(--text1)"
                                : "transparent",
                              color: b.active ? "#fff" : "var(--text2)",
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: b.dis ? "not-allowed" : "pointer",
                              opacity: b.dis ? 0.4 : 1,
                              fontFamily: "'Inter'",
                              transition: "all .15s",
                            }}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── footer note ── */}
          <div
            className="fade-up fade-6"
            style={{
              marginTop: 20,
              fontSize: 11,
              color: "var(--text3)",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Visitor Analytics Admin Panel · Data refreshes every 30s · Backend:{" "}
            {BACKEND}
          </div>
        </div>
      </div>
    </>
  );
}
