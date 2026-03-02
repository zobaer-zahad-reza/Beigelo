import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [count, setCount] = useState(404);

  useEffect(() => {
    const handle = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 18,
        y: (e.clientY / window.innerHeight - 0.5) * 18,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  useEffect(() => {
    const nums = [404, 400, 403, 404, 410, 404];
    let i = 0;
    const interval = setInterval(() => {
      setCount(nums[i % nums.length]);
      i++;
      if (i >= nums.length) clearInterval(interval);
    }, 110);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        .err-display { font-family: 'Cormorant Garamond', serif; }
        .err-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glitch-1 {
          0%, 88%, 100% { clip-path: inset(0 0 96% 0); transform: translate(-3px); opacity: 0.4; }
          94%            { clip-path: inset(30% 0 52% 0); transform: translate(3px); opacity: 0.6; }
        }
        @keyframes glitch-2 {
          0%, 88%, 100% { clip-path: inset(62% 0 28% 0); transform: translate(3px); opacity: 0.3; }
          94%            { clip-path: inset(8% 0 82% 0); transform: translate(-3px); opacity: 0.5; }
        }
        @keyframes shimmer-bw {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .number-bw {
          background: linear-gradient(135deg, #000 0%, #555 40%, #999 60%, #000 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-bw 3s linear infinite;
        }
        .number-glitch { position: relative; }
        .number-glitch::before,
        .number-glitch::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          background: #222;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .number-glitch::before { animation: glitch-1 5s infinite; left: 3px; }
        .number-glitch::after  { animation: glitch-2 5s infinite 0.5s; left: -3px; }

        .floating  { animation: float 5s ease-in-out infinite; }
        .fade-up-1 { animation: fadeUp 0.65s ease 0.05s both; }
        .fade-up-2 { animation: fadeUp 0.65s ease 0.2s  both; }
        .fade-up-3 { animation: fadeUp 0.65s ease 0.35s both; }
        .fade-up-4 { animation: fadeUp 0.65s ease 0.5s  both; }
        .fade-up-5 { animation: fadeUp 0.65s ease 0.65s both; }

        .pulse-ring {
          position: absolute;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 50%;
          animation: pulse-ring 3.2s ease-out infinite;
        }
        .scanline {
          position: absolute; width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
          animation: scanline 7s linear infinite;
          pointer-events: none;
        }

        .btn-filled {
          background: #111; color: #fff;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .btn-filled:hover { background: #333; transform: translateY(-2px); }

        .btn-outline-bw {
          background: transparent;
          border: 1.5px solid #111;
          color: #111;
          transition: all 0.3s ease;
        }
        .btn-outline-bw:hover { background: #111; color: #fff; transform: translateY(-2px); }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        .quick-link { color: #888; transition: color 0.2s ease; text-decoration: none; }
        .quick-link:hover { color: #000; }
      `}</style>

      {/* Grid */}
      <div className="absolute inset-0 grid-bg" />

      {/* Scanline */}
      <div className="scanline" />

      {/* Radial soft glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(240,240,240,0.9) 0%, transparent 70%)" }}
      />

      {/* Decorative circle — top right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%", right: "9%",
          transform: `translate(${mousePos.x * 0.25}px, ${mousePos.y * 0.25}px)`,
          transition: "transform 0.12s ease-out",
        }}
      >
        <div className="floating">
          <div style={{ width:"140px", height:"140px", borderRadius:"50%", border:"1px solid rgba(0,0,0,0.1)" }} />
          <div className="pulse-ring" style={{ width:"140px", height:"140px", top:0, left:0 }} />
        </div>
      </div>

      {/* Decorative circle — bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "16%", left: "6%",
          transform: `translate(${mousePos.x * -0.18}px, ${mousePos.y * -0.18}px)`,
          transition: "transform 0.12s ease-out",
        }}
      >
        <div className="floating" style={{ animationDelay: "2s" }}>
          <div style={{ width:"95px", height:"95px", borderRadius:"50%", border:"1px solid rgba(0,0,0,0.08)" }} />
        </div>
      </div>

      {/* Small circle — mid left */}
      <div
        className="absolute pointer-events-none"
        style={{ top:"45%", left:"3%",
          transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`,
          transition: "transform 0.12s ease-out",
        }}
      >
        <div className="floating" style={{ animationDelay: "1s" }}>
          <div style={{ width:"50px", height:"50px", borderRadius:"50%", border:"1px solid rgba(0,0,0,0.07)" }} />
        </div>
      </div>

      {/* Floating dots */}
      {[
        { top:"20%", left:"15%",  size:"5px", delay:"0s" },
        { top:"70%", left:"86%",  size:"4px", delay:"1.3s" },
        { top:"35%", right:"4%",  size:"6px", delay:"2s" },
        { top:"80%", left:"27%",  size:"4px", delay:"0.8s" },
        { top:"55%", right:"14%", size:"3px", delay:"1.6s" },
      ].map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full floating pointer-events-none"
          style={{ ...dot, width:dot.size, height:dot.size, background:"#000", opacity:0.12, animationDelay:dot.delay }}
        />
      ))}

      {/* ── Main content ── */}
      <div
        className="relative z-10 text-center px-6 max-w-xl mx-auto"
        style={{
          transform: `translate(${mousePos.x * 0.04}px, ${mousePos.y * 0.04}px)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* Brand */}
        <div className="fade-up-1 mb-6">
          <p className="err-body text-xs tracking-[0.55em] uppercase font-medium" style={{ color: "#888" }}>
            — Beigelo —
          </p>
        </div>

        {/* 404 */}
        <div className="fade-up-2 mb-1">
          <h1
            className="number-bw number-glitch err-display font-bold select-none"
            data-text={count}
            style={{ fontSize: "clamp(6rem, 20vw, 13rem)", lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            {count}
          </h1>
        </div>

        {/* Divider */}
        <div className="fade-up-3 flex items-center justify-center gap-4 mb-6">
          <div style={{ height:"1px", width:"44px", background:"rgba(0,0,0,0.2)" }} />
          <span className="err-body text-xs tracking-[0.38em] uppercase font-medium" style={{ color: "#555" }}>
            Page Not Found
          </span>
          <div style={{ height:"1px", width:"44px", background:"rgba(0,0,0,0.2)" }} />
        </div>

        {/* Heading + desc */}
        <div className="fade-up-3 mb-8">
          <h2
            className="err-display font-light text-gray-900 mb-3"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
          >
            This page has{" "}
            <em style={{ color: "#555", fontStyle: "italic" }}>slipped away</em>
          </h2>
          <p className="err-body font-light text-sm leading-relaxed" style={{ color: "#666" }}>
            The page you're looking for doesn't exist, has been moved,
            or is temporarily unavailable.
          </p>
        </div>

        {/* Buttons */}
        <div className="fade-up-4 flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link to="/" className="btn-filled err-body text-xs tracking-[0.2em] uppercase py-3.5 px-8 rounded-sm">
            ← Back to Home
          </Link>
          <Link to="/collection" className="btn-outline-bw err-body text-xs tracking-[0.2em] uppercase py-3.5 px-8 rounded-sm">
            View Collection
          </Link>
        </div>

        {/* Quick links */}
        <div className="fade-up-5">
          <p className="err-body text-xs tracking-widest uppercase mb-3 font-medium" style={{ color: "#aaa" }}>
            You might be looking for
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              { label: "Home",       to: "/" },
              { label: "Collection", to: "/collection" },
              { label: "About",      to: "/about" },
              { label: "Contact",    to: "/contact" },
              { label: "Cart",       to: "/cart" },
            ].map((link) => (
              <Link key={link.label} to={link.to} className="quick-link err-body text-xs font-medium">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <div className="fade-up-5 mt-14">
          <p
            className="err-display font-light italic"
            style={{ fontSize: "0.95rem", color: "#aaa", letterSpacing: "0.05em" }}
          >
            "Define Your Legacy"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;