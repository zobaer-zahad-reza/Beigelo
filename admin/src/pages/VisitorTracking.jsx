import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ─── Google Fonts inject ─────────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; }
    :root {
      --bg:        #F7F6F3;
      --surface:   #FFFFFF;
      --border:    #E8E5DF;
      --border2:   #F0EDE7;
      --text1:     #1C1917;
      --text2:     #57534E;
      --text3:     #A8A29E;
      --accent:    #D4522A;
      --accent2:   #2563EB;
      --accent3:   #059669;
      --accent4:   #7C3AED;
    }
    body { background: var(--bg); }

    @keyframes fadeUp {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes shimmer {
      0%  { background-position: -600px 0; }
      100%{ background-position:  600px 0; }
    }
    .fade-up { animation: fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
    .fade-up-1 { animation-delay:.05s }
    .fade-up-2 { animation-delay:.10s }
    .fade-up-3 { animation-delay:.15s }
    .fade-up-4 { animation-delay:.20s }
    .fade-up-5 { animation-delay:.25s }
    .fade-up-6 { animation-delay:.30s }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.04);
    }
    .card:hover { box-shadow: 0 2px 6px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06); }

    .stat-card {
      background: var(--surface);
      border-radius: 16px;
      border: 1px solid var(--border);
      padding: 22px 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,.04);
      transition: box-shadow .2s;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content:'';
      position:absolute;
      top:0; left:0;
      width:4px; height:100%;
      border-radius:16px 0 0 16px;
    }

    .btn-primary {
      background: var(--text1);
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 8px 16px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display:inline-flex; align-items:center; gap:6px;
      transition: background .15s, transform .1s;
    }
    .btn-primary:hover { background:#292524; }
    .btn-primary:active { transform:scale(.97); }
    .btn-primary:disabled { opacity:.55; cursor:not-allowed; }

    .btn-ghost {
      background: transparent;
      color: var(--text2);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 7px 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display:inline-flex; align-items:center; gap:6px;
      transition: background .15s, border-color .15s;
    }
    .btn-ghost:hover { background: var(--border2); border-color: #D6D0C8; }
    .btn-ghost:disabled { opacity:.45; cursor:not-allowed; }

    .btn-danger {
      background: transparent;
      color: #DC2626;
      border: 1px solid #FCA5A5;
      border-radius: 10px;
      padding: 7px 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display:inline-flex; align-items:center; gap:6px;
      transition: background .15s;
    }
    .btn-danger:hover { background: #FEF2F2; }

    .tab-btn {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 18px;
      border-radius: 10px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--text3);
      transition: all .15s;
    }
    .tab-btn.active {
      background: var(--text1);
      color: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,.18);
    }
    .tab-btn:not(.active):hover { background: var(--border2); color: var(--text2); }

    .table-row:hover { background:#FAFAF8; }

    input[type=text] {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 7px 13px;
      outline: none;
      background: var(--bg);
      color: var(--text1);
      transition: border-color .15s, box-shadow .15s;
      width: 220px;
    }
    input[type=text]:focus {
      border-color: #D4522A;
      box-shadow: 0 0 0 3px rgba(212,82,42,.1);
    }
    input[type=text]::placeholder { color: var(--text3); }

    .badge {
      display:inline-flex; align-items:center; gap:4px;
      font-size:11px; font-weight:700;
      padding:3px 9px; border-radius:20px;
    }
    .badge-blue   { background:#EFF6FF; color:#1D4ED8; }
    .badge-amber  { background:#FFFBEB; color:#B45309; }
    .badge-slate  { background:#F1F5F9; color:#475569; }
    .badge-green  { background:#ECFDF5; color:#065F46; }
    .badge-red    { background:#FEF2F2; color:#991B1B; }

    .progress-bar { height:6px; border-radius:99px; background:#F0EDE7; overflow:hidden; }
    .progress-fill { height:100%; border-radius:99px; transition: width .4s ease; }

    .modal-backdrop {
      position:fixed; inset:0; z-index:60;
      background:rgba(0,0,0,.3);
      backdrop-filter:blur(6px);
      display:flex; align-items:center; justify-content:center;
    }
    .modal {
      background: var(--surface);
      border-radius: 20px;
      padding: 28px;
      max-width: 380px;
      width: calc(100% - 32px);
      box-shadow: 0 24px 64px rgba(0,0,0,.18);
      border: 1px solid var(--border);
    }

    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }

    .chart-tooltip {
      background: var(--text1) !important;
      border: none !important;
      border-radius: 10px !important;
      padding: 8px 14px !important;
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      font-size: 12px !important;
      color: #fff !important;
      box-shadow: 0 8px 24px rgba(0,0,0,.2) !important;
    }
  `}</style>
);

/* ─── constants ───────────────────────────────────────────────────────────── */
const BACKEND_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
  "http://localhost:4000";
const API_BASE = `${BACKEND_URL}/api/visitors`;

const CHART_COLORS = [
  "#D4522A",
  "#2563EB",
  "#059669",
  "#7C3AED",
  "#D97706",
  "#DB2777",
];

const SOURCE_ICONS = {
  Google: "🔍",
  Facebook: "👥",
  Instagram: "📸",
  YouTube: "▶️",
  Twitter: "🐦",
  LinkedIn: "💼",
  Direct: "🎯",
  Bing: "🔎",
};

/* ─── helpers ─────────────────────────────────────────────────────────────── */
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

/* ─── custom chart tooltip ────────────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p style={{ color: "#A8A29E", marginBottom: 4, fontSize: 11 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: "#fff", fontWeight: 700 }}>
          {p.value} {p.name}
        </p>
      ))}
    </div>
  );
};

/* ─── stat card ───────────────────────────────────────────────────────────── */
const StatCard = ({ title, value, sub, icon, accentColor, delay }) => (
  <div
    className={`stat-card fade-up fade-up-${delay}`}
    style={{ "--accent-c": accentColor }}
  >
    <style>{`.stat-card:nth-child(${delay})::before { background: ${accentColor}; }`}</style>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 4,
        height: "100%",
        background: accentColor,
        borderRadius: "16px 0 0 16px",
      }}
    />
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans'",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--text3)",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {title}
      </span>
      <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
    </div>
    <p
      style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 38,
        fontWeight: 400,
        color: "var(--text1)",
        lineHeight: 1,
        margin: "0 0 6px 0",
      }}
    >
      {value ?? "—"}
    </p>
    {sub && (
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans'",
          fontSize: 12,
          color: "var(--text3)",
          margin: 0,
        }}
      >
        {sub}
      </p>
    )}
  </div>
);

/* ─── section header ──────────────────────────────────────────────────────── */
const SectionHeader = ({ title, right }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
    }}
  >
    <h2
      style={{
        fontFamily: "'Plus Jakarta Sans'",
        fontSize: 14,
        fontWeight: 800,
        color: "var(--text1)",
        margin: 0,
      }}
    >
      {title}
    </h2>
    {right}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function VisitorTracking() {
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
  const PER_PAGE = 12;

  /* ── fetch ── */
  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
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
    const t = setInterval(fetchVisitors, 30000);
    return () => clearInterval(t);
  }, [fetchVisitors]);

  /* ── track ── */
  const handleTrack = async () => {
    setTracking(true);
    setTrackMsg(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch(`${API_BASE}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
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
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      setVisitors((v) => v.filter((x) => x._id !== id));
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    setConfirmClear(false);
    try {
      await fetch(`${API_BASE}/all`, { method: "DELETE" });
      setVisitors([]);
    } catch {
      alert("Delete all failed");
    }
  };

  /* ── derived ── */
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
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return {
      day: label,
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

  const pageCounts = visitors.reduce((a, v) => {
    const p = v.page || v.url || "/";
    a[p] = (a[p] || 0) + 1;
    return a;
  }, {});
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([page, count]) => ({
      page: page.length > 30 ? page.slice(0, 30) + "…" : page,
      count,
    }));

  const sourceCounts = visitors.reduce((a, v) => {
    const s = v.source || "Direct";
    a[s] = (a[s] || 0) + 1;
    return a;
  }, {});
  const sourceData = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const deviceCounts = visitors.reduce((a, v) => {
    const d = getDevice(v.userAgent);
    a[d] = (a[d] || 0) + 1;
    return a;
  }, {});
  const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const countryCounts = visitors.reduce((a, v) => {
    const c = v.country || "Unknown";
    a[c] = (a[c] || 0) + 1;
    return a;
  }, {});
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const filtered = visitors.filter((v) => {
    const q = search.toLowerCase();
    return (
      (v.ip || "").includes(q) ||
      (v.page || "").toLowerCase().includes(q) ||
      (v.country || "").toLowerCase().includes(q) ||
      (v.source || "").toLowerCase().includes(q)
    );
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const peakVisits = Math.max(...last14.map((d) => d.visits), 1);

  /* ── render ── */
  return (
    <>
      <FontLoader />
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          padding: "32px 24px",
        }}
      >
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          {/* ══ HEADER ══ */}
          <div
            className="fade-up"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 36,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
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
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 26,
                    fontWeight: 400,
                    color: "var(--text1)",
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  Visitor Analytics
                </h1>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text3)",
                    margin: "3px 0 0",
                    fontWeight: 500,
                  }}
                >
                  Live · auto-refreshes every 30s
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {trackMsg && (
                <span
                  className={`badge ${trackMsg.type === "success" ? "badge-green" : "badge-red"}`}
                  style={{ fontSize: 12 }}
                >
                  {trackMsg.type === "success" ? "✓" : "✗"} {trackMsg.text}
                </span>
              )}
              <button
                className="btn-ghost"
                onClick={fetchVisitors}
                disabled={loading}
              >
                <svg
                  className={loading ? "spin" : ""}
                  width="13"
                  height="13"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
              <button
                className="btn-primary"
                onClick={handleTrack}
                disabled={tracking}
              >
                {tracking ? (
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      border: "2px solid rgba(255,255,255,.35)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                    className="spin"
                  />
                ) : (
                  "👁"
                )}
                {tracking ? "Tracking…" : "Track Visit"}
              </button>
              <button
                className="btn-danger"
                onClick={() => setConfirmClear(true)}
              >
                🗑 Clear All
              </button>
            </div>
          </div>

          {/* error */}
          {error && (
            <div
              className="fade-up"
              style={{
                marginBottom: 20,
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#991B1B",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 13,
              }}
            >
              ⚠ Failed to load: <strong>{error}</strong> — check your backend.
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
                    fontFamily: "'Instrument Serif'",
                    fontSize: 22,
                    margin: "0 0 8px",
                    color: "var(--text1)",
                  }}
                >
                  Delete all visitors?
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text2)",
                    margin: "0 0 24px",
                    lineHeight: 1.6,
                  }}
                >
                  This will permanently remove all{" "}
                  <strong>{total.toLocaleString()}</strong> visitor records.
                  This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn-ghost"
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
                      borderRadius: 10,
                      background: "#DC2626",
                      color: "#fff",
                      border: "none",
                      fontFamily: "'Plus Jakarta Sans'",
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
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <StatCard
              title="Total Visits"
              value={total.toLocaleString()}
              icon="👥"
              sub="All time"
              accentColor="#D4522A"
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
              accentColor="#2563EB"
              delay={2}
            />
            <StatCard
              title="Unique IPs"
              value={uniqueIPs.toLocaleString()}
              icon="🌐"
              sub="Distinct addresses"
              accentColor="#059669"
              delay={3}
            />
            <StatCard
              title="Countries"
              value={Object.keys(countryCounts).length}
              icon="🗺"
              sub="Unique locations"
              accentColor="#7C3AED"
              delay={4}
            />
          </div>

          {/* ══ TABS ══ */}
          <div
            className="fade-up fade-up-5"
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 24,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 5,
              width: "fit-content",
            }}
          >
            {[
              ["overview", "📈 Overview"],
              ["table", "📋 All Visitors"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`tab-btn${tab === key ? " active" : ""}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ══ OVERVIEW TAB ══ */}
          {tab === "overview" && (
            <>
              {/* area chart 14d */}
              <div
                className="card fade-up fade-up-5"
                style={{ padding: 24, marginBottom: 20 }}
              >
                <SectionHeader
                  title="Visits — Last 14 Days"
                  right={
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text3)",
                        fontWeight: 600,
                      }}
                    >
                      Peak: {peakVisits} visits
                    </span>
                  }
                />
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart
                    data={last14}
                    margin={{ top: 5, right: 5, bottom: 0, left: -10 }}
                  >
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#D4522A"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="#D4522A"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE7" />
                    <XAxis
                      dataKey="day"
                      tick={{
                        fontSize: 11,
                        fill: "#A8A29E",
                        fontFamily: "Plus Jakarta Sans",
                      }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                        fill: "#A8A29E",
                        fontFamily: "Plus Jakarta Sans",
                      }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="#D4522A"
                      strokeWidth={2.5}
                      fill="url(#grad1)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: "#D4522A",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* hourly */}
              <div
                className="card fade-up fade-up-5"
                style={{ padding: 24, marginBottom: 20 }}
              >
                <SectionHeader title="Today — Hourly Breakdown" />
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart
                    data={hourly}
                    margin={{ top: 4, right: 5, bottom: 0, left: -10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#F0EDE7"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 10, fill: "#A8A29E" }}
                      interval={3}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 10, fill: "#A8A29E" }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="visits"
                      fill="#2563EB"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 3 col */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                {/* top pages */}
                <div className="card fade-up fade-up-6" style={{ padding: 24 }}>
                  <SectionHeader title="Top Pages" />
                  {topPages.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "var(--text3)",
                        fontSize: 13,
                        padding: "24px 0",
                      }}
                    >
                      No data yet
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {topPages.map((p, i) => (
                        <div key={i}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 5,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--text2)",
                                fontWeight: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 160,
                              }}
                            >
                              {p.page}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
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
                                width: `${(p.count / topPages[0].count) * 100}%`,
                                background:
                                  CHART_COLORS[i % CHART_COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* traffic source */}
                <div className="card fade-up fade-up-6" style={{ padding: 24 }}>
                  <SectionHeader title="Traffic Source" />
                  {sourceData.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "var(--text3)",
                        fontSize: 13,
                        padding: "24px 0",
                      }}
                    >
                      No data yet
                    </p>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={42}
                            outerRadius={62}
                            paddingAngle={3}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                          >
                            {sourceData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={CHART_COLORS[i % CHART_COLORS.length]}
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
                          marginTop: 8,
                        }}
                      >
                        {sourceData.slice(0, 4).map((s, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
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
                                  background:
                                    CHART_COLORS[i % CHART_COLORS.length],
                                  flexShrink: 0,
                                  display: "inline-block",
                                }}
                              />
                              <span
                                style={{
                                  color: "var(--text2)",
                                  fontWeight: 500,
                                }}
                              >
                                {SOURCE_ICONS[s.name] || "🌐"} {s.name}
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
                <div
                  className="card fade-up fade-up-6"
                  style={{
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                  }}
                >
                  <div>
                    <SectionHeader title="Device Type" />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {deviceData.map((d, i) => (
                        <div key={i}>
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
                              {{
                                Desktop: "🖥 Desktop",
                                Mobile: "📱 Mobile",
                                Tablet: "📟 Tablet",
                              }[d.name] || d.name}
                            </span>
                            <span
                              style={{ color: "var(--text1)", fontWeight: 800 }}
                            >
                              {total ? Math.round((d.value / total) * 100) : 0}%
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${total ? (d.value / total) * 100 : 0}%`,
                                background: CHART_COLORS[i],
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid var(--border2)",
                      paddingTop: 20,
                    }}
                  >
                    <SectionHeader title="Top Countries" />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {topCountries.slice(0, 5).map((c, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: 12,
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
                                borderRadius: 4,
                                background:
                                  CHART_COLORS[i % CHART_COLORS.length] + "20",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 800,
                                color: CHART_COLORS[i % CHART_COLORS.length],
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
                      ))}
                      {topCountries.length === 0 && (
                        <p style={{ color: "var(--text3)", fontSize: 12 }}>
                          No data yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ TABLE TAB ══ */}
          {tab === "table" && (
            <div className="card fade-up" style={{ overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 24px",
                  borderBottom: "1px solid var(--border2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 800,
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
                <input
                  type="text"
                  placeholder="Search IP, page, country, source…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "64px 0",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      border: "3px solid var(--border)",
                      borderTopColor: "var(--accent)",
                      borderRadius: "50%",
                    }}
                    className="spin"
                  />
                </div>
              ) : paginated.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "64px 0",
                    color: "var(--text3)",
                    fontSize: 14,
                  }}
                >
                  {visitors.length === 0
                    ? "No visitor data yet. Track a visit first!"
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
                            borderBottom: "1px solid var(--border2)",
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
                                padding: "10px 20px",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "var(--text3)",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
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
                          const idx = (page - 1) * PER_PAGE + i + 1;
                          return (
                            <tr
                              key={v._id || i}
                              className="table-row"
                              style={{
                                borderBottom: "1px solid var(--border2)",
                                transition: "background .12s",
                              }}
                            >
                              <td
                                style={{
                                  padding: "13px 20px",
                                  color: "var(--text3)",
                                  fontWeight: 600,
                                }}
                              >
                                {idx}
                              </td>
                              <td
                                style={{
                                  padding: "13px 20px",
                                  fontFamily: "monospace",
                                  fontSize: 12,
                                  color: "var(--text2)",
                                  fontWeight: 600,
                                }}
                              >
                                {v.ip || v.ipAddress || "—"}
                              </td>
                              <td
                                style={{ padding: "13px 20px", maxWidth: 180 }}
                              >
                                <span
                                  style={{
                                    color: "#D4522A",
                                    fontWeight: 600,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "block",
                                  }}
                                >
                                  {v.page || v.url || "/"}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "13px 20px",
                                  color: "var(--text2)",
                                  fontWeight: 500,
                                }}
                              >
                                {v.country || "—"}
                              </td>
                              <td style={{ padding: "13px 20px" }}>
                                <span className="badge badge-blue">
                                  {SOURCE_ICONS[v.source || "Direct"] || "🌐"}{" "}
                                  {v.source || "Direct"}
                                </span>
                              </td>
                              <td style={{ padding: "13px 20px" }}>
                                <span
                                  className={`badge ${{ Desktop: "badge-slate", Mobile: "badge-amber", Tablet: "badge-green" }[device]}`}
                                >
                                  {
                                    {
                                      Desktop: "🖥",
                                      Mobile: "📱",
                                      Tablet: "📟",
                                    }[device]
                                  }{" "}
                                  {device}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "13px 20px",
                                  color: "var(--text3)",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {fmtDate(v.createdAt || v.timestamp)}
                              </td>
                              <td style={{ padding: "13px 20px" }}>
                                <button
                                  onClick={() => handleDelete(v._id)}
                                  disabled={deletingId === v._id}
                                  title="Delete"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#FCA5A5",
                                    fontSize: 14,
                                    padding: 4,
                                    lineHeight: 1,
                                    borderRadius: 6,
                                    transition: "color .15s",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = "#DC2626")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.color = "#FCA5A5")
                                  }
                                >
                                  {deletingId === v._id ? "…" : "✕"}
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
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "13px 24px",
                        borderTop: "1px solid var(--border2)",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: "var(--text3)", fontWeight: 500 }}>
                        {(page - 1) * PER_PAGE + 1}–
                        {Math.min(page * PER_PAGE, filtered.length)} of{" "}
                        {filtered.length}
                      </span>
                      <div style={{ display: "flex", gap: 5 }}>
                        {[
                          {
                            label: "‹",
                            fn: () => setPage((p) => Math.max(1, p - 1)),
                            dis: page === 1,
                          },
                          ...Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => ({
                              label: i + 1,
                              fn: () => setPage(i + 1),
                              dis: false,
                              active: page === i + 1,
                            }),
                          ),
                          {
                            label: "›",
                            fn: () =>
                              setPage((p) => Math.min(totalPages, p + 1)),
                            dis: page === totalPages,
                          },
                        ].map((b, i) => (
                          <button
                            key={i}
                            onClick={b.fn}
                            disabled={b.dis}
                            style={{
                              minWidth: 30,
                              height: 30,
                              borderRadius: 8,
                              border: `1px solid ${b.active ? "transparent" : "var(--border)"}`,
                              background: b.active
                                ? "var(--text1)"
                                : "transparent",
                              color: b.active ? "#fff" : "var(--text2)",
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: b.dis ? "not-allowed" : "pointer",
                              opacity: b.dis ? 0.4 : 1,
                              fontFamily: "'Plus Jakarta Sans'",
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
        </div>
      </div>
    </>
  );
}
