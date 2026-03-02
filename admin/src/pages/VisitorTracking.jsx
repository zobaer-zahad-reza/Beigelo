import { useState, useEffect, useCallback } from "react";
import {
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

const API_BASE = "http://localhost:4000/api/visitors";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const StatCard = ({ title, value, icon, sub, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value ?? "—"}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}>
      {icon}
    </div>
  </div>
);

export default function VisitorTracking() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [trackMsg, setTrackMsg] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 10;

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      // support both { visitors: [] } and plain array
      setVisitors(Array.isArray(data) ? data : data.visitors ?? []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const handleTrack = async () => {
    setTracking(true);
    setTrackMsg(null);
    try {
      const res = await fetch(`${API_BASE}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setTrackMsg({ type: "success", text: data.message || "Visit tracked successfully!" });
      fetchVisitors();
    } catch (err) {
      setTrackMsg({ type: "error", text: "Failed to track: " + err.message });
    } finally {
      setTracking(false);
      setTimeout(() => setTrackMsg(null), 3000);
    }
  };

  // ── derived stats ──
  const total = visitors.length;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = visitors.filter(
    (v) => (v.createdAt || v.timestamp || "").slice(0, 10) === today
  ).length;

  const uniqueIPs = new Set(visitors.map((v) => v.ip || v.ipAddress)).size;

  // daily chart data (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const count = visitors.filter(
      (v) => (v.createdAt || v.timestamp || "").slice(0, 10) === key
    ).length;
    return { day: label, visits: count };
  });

  // top pages
  const pageCounts = visitors.reduce((acc, v) => {
    const p = v.page || v.url || "/";
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ page: page.length > 25 ? page.slice(0, 25) + "…" : page, count }));

  // device / browser breakdown
  const deviceCounts = visitors.reduce((acc, v) => {
    const ua = (v.userAgent || "").toLowerCase();
    const type = /mobile|android|iphone|ipad/.test(ua) ? "Mobile" : "Desktop";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));

  // filtered table
  const filtered = visitors.filter((v) => {
    const q = search.toLowerCase();
    return (
      (v.ip || v.ipAddress || "").includes(q) ||
      (v.page || v.url || "").toLowerCase().includes(q) ||
      (v.country || "").toLowerCase().includes(q)
    );
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const fmtDate = (str) => {
    if (!str) return "—";
    return new Date(str).toLocaleString("en-BD", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visitor Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time server-side visitor tracking</p>
        </div>
        <div className="flex items-center gap-3">
          {trackMsg && (
            <span
              className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
                trackMsg.type === "success"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trackMsg.text}
            </span>
          )}
          <button
            onClick={fetchVisitors}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleTrack}
            disabled={tracking}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {tracking ? "Tracking…" : "Track Visit"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Failed to load visitors: <strong>{error}</strong>. Make sure your backend is running on port 4000.</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Visitors"
          value={total.toLocaleString()}
          icon="👥"
          sub="All time"
          color="bg-indigo-100"
        />
        <StatCard
          title="Today's Visits"
          value={todayCount}
          icon="📅"
          sub={new Date().toLocaleDateString("en-BD", { day: "2-digit", month: "long" })}
          color="bg-emerald-100"
        />
        <StatCard
          title="Unique IPs"
          value={uniqueIPs.toLocaleString()}
          icon="🌐"
          sub="Distinct addresses"
          color="bg-amber-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Line chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Visits — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13 }}
              />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Device Type</h2>
          {deviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {deviceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span className="text-xs text-gray-600">{v}</span>}
                />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Top Pages bar chart */}
      {topPages.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Top Pages</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topPages} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis dataKey="page" type="category" tick={{ fontSize: 12, fill: "#6b7280" }} width={140} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Visitor Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-700">All Visitors</h2>
          <input
            type="text"
            placeholder="Search IP, page, country…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-52 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {visitors.length === 0 ? "No visitor data found." : "No results match your search."}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3">#</th>
                    <th className="text-left px-5 py-3">IP Address</th>
                    <th className="text-left px-5 py-3">Page / URL</th>
                    <th className="text-left px-5 py-3">Country</th>
                    <th className="text-left px-5 py-3">Device</th>
                    <th className="text-left px-5 py-3">Referrer</th>
                    <th className="text-left px-5 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((v, i) => {
                    const ua = (v.userAgent || "").toLowerCase();
                    const isMobile = /mobile|android|iphone|ipad/.test(ua);
                    const idx = (currentPage - 1) * PER_PAGE + i + 1;
                    return (
                      <tr key={v._id || i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-gray-400">{idx}</td>
                        <td className="px-5 py-3 font-mono text-gray-700 text-xs">
                          {v.ip || v.ipAddress || "—"}
                        </td>
                        <td className="px-5 py-3 text-indigo-600 max-w-[180px] truncate">
                          {v.page || v.url || "/"}
                        </td>
                        <td className="px-5 py-3 text-gray-600">{v.country || "—"}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              isMobile
                                ? "bg-amber-100 text-amber-700"
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {isMobile ? "📱 Mobile" : "🖥 Desktop"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs max-w-[120px] truncate">
                          {v.referrer || "direct"}
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {fmtDate(v.createdAt || v.timestamp)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
                <span className="text-gray-400 text-xs">
                  Showing {(currentPage - 1) * PER_PAGE + 1}–
                  {Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                          currentPage === page
                            ? "bg-gray-800 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}