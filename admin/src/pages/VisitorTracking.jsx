import { useState, useEffect, useCallback, useMemo } from "react";
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

/* ─── GLOBAL STYLES ──────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@500&display=swap');
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

    @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin   { to { transform: rotate(360deg); } }
    @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:.4; } }

    .fade-up { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
    .f1{animation-delay:.04s} .f2{animation-delay:.08s} .f3{animation-delay:.12s}
    .f4{animation-delay:.16s} .f5{animation-delay:.20s} .f6{animation-delay:.24s}

    .spin  { animation: spin .85s linear infinite; }
    .pulse { animation: pulse 2s ease-in-out infinite; }

    .card { background:var(--surface); border:1px solid var(--border); border-radius:14px; transition:box-shadow .2s; }
    .card:hover { box-shadow:0 2px 14px rgba(0,0,0,.06); }

    .btn {
      font-family:'Inter',sans-serif; font-size:13px; font-weight:600;
      padding:7px 14px; border-radius:9px; border:1px solid var(--border);
      background:var(--surface); color:var(--text2); cursor:pointer;
      display:inline-flex; align-items:center; gap:6px;
      transition:all .15s; white-space:nowrap;
    }
    .btn:hover   { background:var(--bg); }
    .btn:active  { transform:scale(.97); }
    .btn:disabled{ opacity:.45; cursor:not-allowed; }
    .btn-primary { background:var(--text1); color:#fff; border-color:var(--text1); }
    .btn-primary:hover { background:#2d2925; }
    .btn-danger  { color:#b91c1c; border-color:#fca5a5; background:transparent; }
    .btn-danger:hover { background:#fef2f2; }

    .tab-btn {
      font-family:'Inter',sans-serif; font-size:13px; font-weight:600;
      padding:7px 16px; border-radius:9px; border:none;
      background:transparent; cursor:pointer; color:var(--text3);
      transition:all .15s; white-space:nowrap;
    }
    .tab-btn.active { background:var(--text1); color:#fff; }
    .tab-btn:not(.active):hover { background:var(--border); color:var(--text2); }

    .badge { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; padding:2px 8px; border-radius:20px; }
    .badge-blue   { background:#eff6ff; color:#1d4ed8; }
    .badge-amber  { background:#fffbeb; color:#92400e; }
    .badge-slate  { background:#f1f5f9; color:#475569; }
    .badge-green  { background:#ecfdf5; color:#065f46; }
    .badge-red    { background:#fef2f2; color:#991b1b; }

    .search-wrap { position:relative; }
    .search-wrap svg { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text3); pointer-events:none; }
    .search-input {
      font-family:'Inter',sans-serif; font-size:13px;
      border:1px solid var(--border); border-radius:9px;
      padding:7px 12px 7px 32px; outline:none;
      background:var(--bg); color:var(--text1);
      transition:border-color .15s, box-shadow .15s; width:260px;
    }
    .search-input:focus { border-color:var(--red); box-shadow:0 0 0 3px rgba(200,75,47,.08); }
    .search-input::placeholder { color:var(--text3); }

    .progress-bar  { height:5px; border-radius:99px; background:var(--border); overflow:hidden; }
    .progress-fill { height:100%; border-radius:99px; transition:width .4s ease; }

    .tr:hover td { background:#fafaf8; }
    .tr td       { transition:background .1s; }

    .modal-backdrop {
      position:fixed; inset:0; z-index:100;
      background:rgba(0,0,0,.35); backdrop-filter:blur(4px);
      display:flex; align-items:center; justify-content:center;
    }
    .modal {
      background:var(--surface); border-radius:18px; padding:28px;
      max-width:360px; width:calc(100% - 32px);
      border:1px solid var(--border); box-shadow:0 20px 60px rgba(0,0,0,.15);
    }
    .tt {
      background:var(--text1) !important; border:none !important;
      border-radius:9px !important; padding:8px 14px !important;
      font-family:'Inter',sans-serif !important; font-size:12px !important; color:#fff !important;
    }
    .empty-state {
      display:flex; flex-direction:column; align-items:center;
      justify-content:center; padding:56px 20px; gap:10px;
      color:var(--text3); text-align:center;
    }
    @media(max-width:900px){ .three-col{ grid-template-columns:1fr !important; } }
  `}</style>
);

/* ─── CONFIG & CONSTANTS ─────────────────────────────────────────────────── */
const BACKEND = import.meta?.env?.VITE_BACKEND_URL ?? "http://localhost:4000";
const API = `${BACKEND}/api/visitors`;
const COLORS = [
  "#C84B2F",
  "#2156C8",
  "#1A7A52",
  "#6B30B8",
  "#C07B18",
  "#C02680",
];
const PER_PAGE = 12;

const SOURCE_ICON = {
  Google: "🔍",
  Facebook: "👥",
  Instagram: "📸",
  YouTube: "▶️",
  LinkedIn: "💼",
  Direct: "🎯",
  Bing: "🔎",
  Twitter: "🐦",
};
const DEVICE_ICON = { Desktop: "🖥", Mobile: "📱", Tablet: "📟" };
const DEVICE_BADGE = {
  Desktop: "badge-slate",
  Mobile: "badge-amber",
  Tablet: "badge-green",
};

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const fmtDate = (s) => {
  if (!s) return "—";
  return new Date(s).toLocaleString("en-BD", {
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

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const IcoRefresh = ({ spin }) => (
  <svg
    className={spin ? "spin" : ""}
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
);
const IcoEye = () => (
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
);
const IcoTrash = () => (
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
);
const IcoSearch = () => (
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
);
const IcoX = () => (
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
);

/* ─── REUSABLE COMPONENTS ────────────────────────────────────────────────── */
const Spinner = ({ size = 32 }) => (
  <div
    className="spin"
    style={{
      width: size,
      height: size,
      border: "3px solid var(--border)",
      borderTopColor: "var(--red)",
      borderRadius: "50%",
    }}
  />
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tt">
      <p style={{ color: "#A8A29E", fontSize: 11, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontWeight: 700, margin: 0 }}>
          {p.value} {p.name}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, sub, icon, color, delay }) => (
  <div
    className={`card fade-up f${delay}`}
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
        fontFamily: "'Playfair Display',serif",
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

  /* ── API CALLS ── */
  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/all`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setVisitors(Array.isArray(data) ? data : (data.visitors ?? []));
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 30000);
    return () => clearInterval(interval);
  }, [fetchVisitors]);

  const handleTrack = async () => {
    setTracking(true);
    setTrackMsg(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch(`${API}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
          utm_source: params.get("utm_source") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Track failed");
      setTrackMsg({ ok: true, text: data.message || "Visit tracked!" });
      fetchVisitors();
    } catch (e) {
      setTrackMsg({ ok: false, text: e.message });
    } finally {
      setTracking(false);
      setTimeout(() => setTrackMsg(null), 3500);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setVisitors((v) => v.filter((x) => x._id !== id));
    } catch {
      alert("Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    setConfirmClear(false);
    try {
      const res = await fetch(`${API}/all`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setVisitors([]);
    } catch {
      alert("Delete all failed. Please try again.");
    }
  };

  /* ── MEMOIZED DATA PROCESSING (Fixes performance & timezone bugs) ── */
  const stats = useMemo(() => {
    const total = visitors.length;
    const now = new Date();
    // Using local timezone start of day to avoid midnight wrap-around bugs
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const todayEnd = todayStart + 86400000; // +24 hours

    let todayCount = 0;
    const pCounts = {},
      sCounts = {},
      cCounts = {},
      dCounts = {};
    const ips = new Set();

    // Initialize empty charts to prevent breaks
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, "0")}:00`,
      visits: 0,
    }));
    const last14Data = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - (13 - i),
      );
      return {
        day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        visits: 0,
      };
    });

    visitors.forEach((v) => {
      const page = v.page || v.url || "/";
      const source = v.source || "Direct";
      const country = v.country || "Unknown";
      const device = getDevice(v.userAgent);

      if (v.ip || v.ipAddress) ips.add(v.ip || v.ipAddress);

      pCounts[page] = (pCounts[page] || 0) + 1;
      sCounts[source] = (sCounts[source] || 0) + 1;
      if (v.country) cCounts[country] = (cCounts[country] || 0) + 1;
      dCounts[device] = (dCounts[device] || 0) + 1;

      const t = new Date(v.createdAt || v.timestamp || 0);
      const tTime = t.getTime();

      // Today's Hourly Graph
      if (tTime >= todayStart && tTime < todayEnd) {
        todayCount++;
        hourlyData[t.getHours()].visits++;
      }

      // Last 14 Days Area Graph
      const diffDays = Math.floor(
        (todayStart -
          new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()) /
          86400000,
      );
      if (diffDays >= 0 && diffDays < 14) {
        last14Data[13 - diffDays].visits++;
      }
    });

    return {
      total,
      todayCount,
      uniqueIPs: ips.size,
      topPages: Object.entries(pCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([page, count]) => ({ page, count })),
      sourceData: Object.entries(sCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value })),
      topCountries: Object.entries(cCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value })),
      deviceCounts: dCounts,
      countryCount: Object.keys(cCounts).length,
      hourly: hourlyData,
      last14: last14Data,
      peakVisits: Math.max(...last14Data.map((d) => d.visits), 0),
      avgDaily: total > 0 ? Math.round(total / 14) : 0,
    };
  }, [visitors]);

  /* ── SEARCH & PAGINATION (Optimized) ── */
  const { filtered, paginated, totalPages, safePage, pageNums } =
    useMemo(() => {
      const q = search.toLowerCase().trim();
      const result = !q
        ? visitors
        : visitors.filter(
            (v) =>
              (v.ip || v.ipAddress || "").includes(q) ||
              (v.page || v.url || "").toLowerCase().includes(q) ||
              (v.country || "").toLowerCase().includes(q) ||
              (v.source || "").toLowerCase().includes(q),
          );

      const totalPgs = Math.max(1, Math.ceil(result.length / PER_PAGE));
      const safePg = Math.max(1, Math.min(page, totalPgs));
      const paginatedData = result.slice(
        (safePg - 1) * PER_PAGE,
        safePg * PER_PAGE,
      );

      // Pagination numbers logic
      const start = Math.max(1, safePg - 2);
      const end = Math.min(totalPgs, start + 4);
      const nums = Array.from({ length: end - start + 1 }, (_, i) => start + i);

      return {
        filtered: result,
        paginated: paginatedData,
        totalPages: totalPgs,
        safePage: safePg,
        pageNums: nums,
      };
    }, [visitors, search, page]);

  // Flag for purely empty state
  const isCompletelyEmpty = visitors.length === 0 && !loading;

  /* ── RENDER ── */
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
          {/* HEADER */}
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
                    lineHeight: 1.15,
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
                    className="pulse"
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
                    Live · auto-refreshes every 30s
                  </span>
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
                  className={`badge ${trackMsg.ok ? "badge-green" : "badge-red"}`}
                  style={{ fontSize: 12, padding: "4px 10px" }}
                >
                  {trackMsg.ok ? "✓" : "✗"} {trackMsg.text}
                </span>
              )}
              <button
                className="btn"
                onClick={fetchVisitors}
                disabled={loading}
              >
                <IcoRefresh spin={loading} /> Refresh
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
                  <IcoEye />
                )}
                {tracking ? "Tracking…" : "Track Visit"}
              </button>
              {visitors.length > 0 && (
                <button
                  className="btn btn-danger"
                  onClick={() => setConfirmClear(true)}
                >
                  <IcoTrash /> Clear All
                </button>
              )}
            </div>
          </div>

          {/* ERRORS & CONFIRMATION */}
          {error && (
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
              ⚠ Could not reach backend: <strong>{error}</strong>
            </div>
          )}

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
                    lineHeight: 1.65,
                    marginBottom: 22,
                  }}
                >
                  This will permanently remove all{" "}
                  <strong>{stats.total.toLocaleString()}</strong> visitor
                  records. This cannot be undone.
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
                      fontFamily: "Inter",
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

          {/* EMPTY DASHBOARD STATE */}
          {isCompletelyEmpty ? (
            <div
              className="card fade-up"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "100px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  color: "var(--text1)",
                  fontSize: 24,
                  marginBottom: 8,
                }}
              >
                No Visitors Yet
              </h2>
              <p
                style={{
                  color: "var(--text2)",
                  fontSize: 14,
                  maxWidth: 400,
                  lineHeight: 1.5,
                  marginBottom: 24,
                }}
              >
                Your analytics dashboard is ready, but no traffic has been
                recorded. Click "Track Visit" above to log a test visit, or
                connect your website's frontend.
              </p>
              <button
                className="btn btn-primary"
                onClick={handleTrack}
                disabled={tracking}
              >
                Track First Visit
              </button>
            </div>
          ) : (
            <>
              {/* STAT CARDS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                <StatCard
                  title="Total Visits"
                  value={stats.total.toLocaleString()}
                  icon="👥"
                  sub="All time"
                  color="var(--red)"
                  delay={1}
                />
                <StatCard
                  title="Today"
                  value={stats.todayCount}
                  icon="📅"
                  sub="Local timezone"
                  color="var(--blue)"
                  delay={2}
                />
                <StatCard
                  title="Unique IPs"
                  value={stats.uniqueIPs.toLocaleString()}
                  icon="🌐"
                  sub="Distinct addresses"
                  color="var(--green)"
                  delay={3}
                />
                <StatCard
                  title="Countries"
                  value={stats.countryCount}
                  icon="🗺"
                  sub="Unique locations"
                  color="var(--purple)"
                  delay={4}
                />
                <StatCard
                  title="Avg / Day"
                  value={stats.avgDaily}
                  icon="📊"
                  sub="Last 14 days"
                  color="var(--amber)"
                  delay={5}
                />
                <StatCard
                  title="Peak Day"
                  value={stats.peakVisits}
                  icon="🏆"
                  sub="Highest single day"
                  color="var(--red)"
                  delay={6}
                />
              </div>

              {/* TABS */}
              <div
                className="fade-up f5"
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

              {/* OVERVIEW TAB */}
              {tab === "overview" && (
                <>
                  <div
                    className="card fade-up f5"
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
                          Peak: {stats.peakVisits} · Avg: {stats.avgDaily}/day
                        </span>
                      }
                    />
                    {loading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "40px 0",
                        }}
                      >
                        <Spinner />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart
                          data={stats.last14}
                          margin={{ top: 5, right: 5, bottom: 0, left: -15 }}
                        >
                          <defs>
                            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor="#C84B2F"
                                stopOpacity={0.15}
                              />
                              <stop
                                offset="95%"
                                stopColor="#C84B2F"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#F0EDE7"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="day"
                            tick={{
                              fontSize: 11,
                              fill: "#9C9690",
                              fontFamily: "Inter",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{
                              fontSize: 11,
                              fill: "#9C9690",
                              fontFamily: "Inter",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="visits"
                            name="visits"
                            stroke="#C84B2F"
                            strokeWidth={3}
                            fill="url(#g1)"
                            activeDot={{
                              r: 6,
                              fill: "#C84B2F",
                              stroke: "#fff",
                              strokeWidth: 2,
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div
                    className="card fade-up f5"
                    style={{ padding: 22, marginBottom: 16 }}
                  >
                    <SecHead title="Today — Hourly Breakdown" />
                    {loading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "24px 0",
                        }}
                      >
                        <Spinner size={24} />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={140}>
                        <BarChart
                          data={stats.hourly}
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
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 10, fill: "#9C9690" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ fill: "rgba(0,0,0,0.03)" }}
                          />
                          <Bar
                            dataKey="visits"
                            name="visits"
                            fill="#2156C8"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* 3 Columns Grid */}
                  <div
                    className="three-col"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 14,
                      marginBottom: 16,
                    }}
                  >
                    {/* Top Pages */}
                    <div className="card fade-up f6" style={{ padding: 22 }}>
                      <SecHead title="Top Pages" />
                      {stats.topPages.length === 0 ? (
                        <div
                          className="empty-state"
                          style={{ padding: "24px 0" }}
                        >
                          <span style={{ fontSize: 24 }}>📭</span>
                          <span style={{ fontSize: 12 }}>No page data</span>
                        </div>
                      ) : (
                        stats.topPages.map((p, i) => {
                          const maxCount = stats.topPages.length
                            ? stats.topPages[0].count
                            : 1;
                          return (
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
                                  title={p.page}
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
                                    width: `${Math.round((p.count / maxCount) * 100)}%`,
                                    background: COLORS[i % COLORS.length],
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Traffic Source */}
                    <div className="card fade-up f6" style={{ padding: 22 }}>
                      <SecHead title="Traffic Source" />
                      {stats.sourceData.length === 0 ? (
                        <div
                          className="empty-state"
                          style={{ padding: "24px 0" }}
                        >
                          <span style={{ fontSize: 24 }}>📭</span>
                          <span style={{ fontSize: 12 }}>No source data</span>
                        </div>
                      ) : (
                        <>
                          <ResponsiveContainer width="100%" height={140}>
                            <PieChart>
                              <Pie
                                data={stats.sourceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={42}
                                outerRadius={60}
                                paddingAngle={4}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                              >
                                {stats.sourceData.map((_, i) => (
                                  <Cell
                                    key={i}
                                    fill={COLORS[i % COLORS.length]}
                                  />
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
                              marginTop: 12,
                            }}
                          >
                            {stats.sourceData.slice(0, 5).map((s, i) => (
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
                                    {SOURCE_ICON[s.name] || "🌐"} {s.name}
                                  </span>
                                </div>
                                <span
                                  style={{
                                    fontWeight: 800,
                                    color: "var(--text1)",
                                  }}
                                >
                                  {s.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Device & Country */}
                    <div className="card fade-up f6" style={{ padding: 22 }}>
                      <SecHead title="Device Type" />
                      {Object.keys(stats.deviceCounts).length === 0 ? (
                        <p style={{ color: "var(--text3)", fontSize: 12 }}>
                          No data yet
                        </p>
                      ) : (
                        Object.entries(stats.deviceCounts).map(
                          ([d, cnt], i) => (
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
                                  {DEVICE_ICON[d] || "💻"} {d}
                                </span>
                                <span
                                  style={{
                                    color: "var(--text1)",
                                    fontWeight: 800,
                                  }}
                                >
                                  {stats.total
                                    ? Math.round((cnt / stats.total) * 100)
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${stats.total ? Math.round((cnt / stats.total) * 100) : 0}%`,
                                    background: COLORS[i],
                                  }}
                                />
                              </div>
                            </div>
                          ),
                        )
                      )}

                      <div
                        style={{
                          borderTop: "1px solid var(--border)",
                          paddingTop: 18,
                          marginTop: 18,
                        }}
                      >
                        <SecHead title="Top Countries" />
                        {stats.topCountries.length === 0 ? (
                          <p style={{ color: "var(--text3)", fontSize: 12 }}>
                            No data yet
                          </p>
                        ) : (
                          stats.topCountries.slice(0, 5).map((c, i) => (
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
                                    background:
                                      COLORS[i % COLORS.length] + "22",
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
                                  style={{
                                    color: "var(--text2)",
                                    fontWeight: 600,
                                  }}
                                >
                                  {c.name}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontWeight: 800,
                                  color: "var(--text1)",
                                }}
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

              {/* TABLE TAB */}
              {tab === "table" && (
                <div className="card fade-up" style={{ overflow: "hidden" }}>
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
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
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
                        {filtered.length} matching
                      </span>
                    </div>
                    <div className="search-wrap">
                      <IcoSearch />
                      <input
                        className="search-input"
                        type="text"
                        placeholder="Search IP, page, country, source…"
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
                        padding: "64px 0",
                      }}
                    >
                      <Spinner />
                    </div>
                  ) : paginated.length === 0 ? (
                    <div className="empty-state">
                      <span style={{ fontSize: 40 }}>🔍</span>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--text2)",
                        }}
                      >
                        No results found
                      </p>
                      <p style={{ fontSize: 12 }}>
                        Try adjusting your search keywords.
                      </p>
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
                              ].map((h, index) => (
                                <th
                                  key={index}
                                  style={{
                                    textAlign: "left",
                                    padding: "10px 18px",
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
                                      color: "var(--text2)",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {v.ip || v.ipAddress || "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "12px 18px",
                                      maxWidth: 160,
                                    }}
                                  >
                                    <span
                                      title={v.page || v.url || "/"}
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
                                      {SOURCE_ICON[v.source || "Direct"] ||
                                        "🌐"}{" "}
                                      {v.source || "Direct"}
                                    </span>
                                  </td>
                                  <td style={{ padding: "12px 18px" }}>
                                    <span
                                      className={`badge ${DEVICE_BADGE[device] || "badge-slate"}`}
                                    >
                                      {DEVICE_ICON[device] || "💻"} {device}
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
                                      title="Delete this record"
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
                                    >
                                      {deletingId === v._id ? "…" : <IcoX />}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

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
                          <span
                            style={{ color: "var(--text3)", fontWeight: 500 }}
                          >
                            {(safePage - 1) * PER_PAGE + 1}–
                            {Math.min(safePage * PER_PAGE, filtered.length)} of{" "}
                            {filtered.length}
                          </span>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              className="btn"
                              style={{
                                minWidth: 30,
                                height: 30,
                                padding: 0,
                                justifyContent: "center",
                              }}
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              disabled={safePage === 1}
                            >
                              ‹
                            </button>
                            {pageNums.map((n) => (
                              <button
                                key={n}
                                style={{
                                  minWidth: 30,
                                  height: 30,
                                  borderRadius: 7,
                                  border: `1px solid ${safePage === n ? "transparent" : "var(--border)"}`,
                                  background:
                                    safePage === n
                                      ? "var(--text1)"
                                      : "transparent",
                                  color:
                                    safePage === n ? "#fff" : "var(--text2)",
                                  fontWeight: 700,
                                  fontSize: 12,
                                  cursor: "pointer",
                                  fontFamily: "Inter",
                                  transition: "all .15s",
                                }}
                                onClick={() => setPage(n)}
                              >
                                {n}
                              </button>
                            ))}
                            <button
                              className="btn"
                              style={{
                                minWidth: 30,
                                height: 30,
                                padding: 0,
                                justifyContent: "center",
                              }}
                              onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                              }
                              disabled={safePage === totalPages}
                            >
                              ›
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          <p
            className="fade-up f6"
            style={{
              marginTop: 24,
              fontSize: 11,
              color: "var(--text3)",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Visitor Analytics · Refreshes every 30s · Connected to {API}
          </p>
        </div>
      </div>
    </>
  );
}
