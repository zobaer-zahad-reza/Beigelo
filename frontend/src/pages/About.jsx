import React, { useEffect, useRef, useState } from "react";
import Title from "../components/Title";
import aboutImage from "../assets/about_img.webp";
import NewsletterBox from "../components/NewsletterBox";
import LocationMap from "../components/LocationMap";


const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

/* ── Animated counter ── */
const Counter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── Reveal wrapper ── */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ══════════════════════════════════════════════════ */
const About = () => {
  return (
    <div className="overflow-x-hidden" style={{ fontFamily: "'Georgia', serif" }}>

      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .about-display { font-family: 'Cormorant Garamond', serif; }
        .about-body    { font-family: 'DM Sans', sans-serif; }
        .beige-line::after {
          content: '';
          display: block;
          width: 48px;
          height: 2px;
          background: #b5936b;
          margin-top: 12px;
        }
        .card-hover {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.08);
        }
        .timeline-dot {
          width: 12px; height: 12px;
          background: #b5936b;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }
      `}</style>

      {/* HERO BANNER */}
      <section
        className="relative flex items-center justify-center text-center overflow-hidden"
        style={{
          minHeight: "60vh",
          background: "linear-gradient(135deg, #faf6f1 0%, #f0e8dc 50%, #e8ddd0 100%)",
        }}
      >
        {/* decorative circles */}
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"320px", height:"320px", borderRadius:"50%", background:"rgba(181,147,107,0.08)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-60px", left:"-60px", width:"220px", height:"220px", borderRadius:"50%", background:"rgba(181,147,107,0.06)", pointerEvents:"none" }} />

        <div className="relative z-10 px-6 py-20">
          <p className="about-body text-xs tracking-[0.3em] text-amber-700 uppercase mb-4">
            Est. 2022 — Dhaka, Bangladesh
          </p>
          <h1
            className="about-display font-light text-gray-800"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)", lineHeight: 1.1 }}
          >
            Crafted for the <br />
            <em style={{ color: "#b5936b" }}>Quiet Bold</em>
          </h1>
          <p className="about-body text-gray-500 mt-6 max-w-xl mx-auto text-base font-light leading-relaxed">
            Beigelo is where minimalism meets intention — accessories that say more by saying less.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <div style={{ height:"1px", width:"40px", background:"#b5936b" }} />
            <span className="about-body text-xs tracking-widest text-amber-700 uppercase">Our Story</span>
            <div style={{ height:"1px", width:"40px", background:"#b5936b" }} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-900 py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { end: 7000, suffix: "+", label: "Happy Customers" },
            { end: 340,   suffix: "+", label: "Products Curated" },
            { end: 3,     suffix: " yrs", label: "Of Excellence" },
            { end: 99,    suffix: "%",  label: "Satisfaction Rate" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div>
                <p className="about-display font-light text-amber-400" style={{ fontSize: "2.6rem" }}>
                  <Counter end={s.end} suffix={s.suffix} />
                </p>
                <p className="about-body text-gray-400 text-xs tracking-widest uppercase mt-1">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              <img
                src={aboutImage}
                alt="About Beigelo"
                loading="lazy"
                className="w-full object-cover rounded-sm"
                style={{ maxHeight: "520px", objectFit: "cover" }}
              />
              {/* floating badge */}
              <div
                className="absolute -bottom-6 -right-6 bg-white shadow-xl px-6 py-5 rounded-sm hidden md:block"
                style={{ borderLeft: "3px solid #b5936b" }}
              >
                <p className="about-display text-3xl font-semibold text-gray-800">3+</p>
                <p className="about-body text-xs text-gray-500 tracking-wide uppercase mt-0.5">Years of Trust</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="about-body">
              <p className="text-xs tracking-[0.3em] text-amber-700 uppercase mb-4">Who We Are</p>
              <h2 className="about-display font-light text-gray-800 beige-line" style={{ fontSize: "2.4rem", lineHeight: 1.2 }}>
                Born from a passion<br />for timeless design
              </h2>
              <div className="mt-8 space-y-4 text-gray-500 font-light leading-relaxed">
                <p>
                  Beigelo was born from a passion for minimalist design and a desire to provide a curated collection of accessories that stand the test of time. Our journey began with a simple idea: to offer beautifully crafted watches, unique ornaments, and essential caps that bring style and simplicity to your everyday life.
                </p>
                <p>
                  Since our inception, we've worked tirelessly to select each piece for its quality, craftsmanship, and timeless appeal — from the moment you browse our collection to the moment your item arrives at your door.
                </p>
              </div>

              <div className="mt-8 p-5 rounded-sm" style={{ background:"#faf6f1", borderLeft:"3px solid #b5936b" }}>
                <p className="about-display italic text-gray-700" style={{ fontSize: "1.15rem" }}>
                  "Our mission is to empower our customers with a sense of confidence and effortless style."
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 px-6" style={{ background: "#faf6f1" }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <p className="about-body text-xs tracking-[0.3em] text-amber-700 uppercase mb-3">Our Journey</p>
              <h2 className="about-display font-light text-gray-800" style={{ fontSize: "2.2rem" }}>
                Milestones that shaped us
              </h2>
            </div>
          </Reveal>

          <div className="space-y-8">
            {[
              { year: "2022", title: "Beigelo is Founded", desc: "Started with a small collection of handpicked watches and ornaments in Dhaka." },
              { year: "2023", title: "1,000 Orders Milestone", desc: "Crossed our first thousand orders — a moment that proved minimalism has its audience." },
              { year: "2023", title: "Caps Collection Launch", desc: "Expanded into headwear with our signature caps line, loved by streetwear enthusiasts." },
              { year: "2024", title: "Nationwide Delivery", desc: "Launched delivery across all 64 districts of Bangladesh with same-day Dhaka service." },
              { year: "2025", title: "10,000+ Happy Customers", desc: "A community that grew organically — no gimmicks, just quality and trust." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="timeline-dot" />
                    {i < 4 && <div style={{ width:"1px", flex:1, background:"#d4b896", marginTop:"4px" }} />}
                  </div>
                  <div className="pb-8">
                    <span className="about-body text-xs tracking-widest text-amber-700 uppercase font-medium">{item.year}</span>
                    <h3 className="about-display text-gray-800 font-semibold mt-1" style={{ fontSize: "1.2rem" }}>{item.title}</h3>
                    <p className="about-body text-gray-500 font-light mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div className="text-center mb-14">
            <p className="about-body text-xs tracking-[0.3em] text-amber-700 uppercase mb-3">Our Promise</p>
            <h2 className="about-display font-light text-gray-800" style={{ fontSize: "2.2rem" }}>
              Why choose Beigelo?
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "◈",
              title: "Quality Assurance",
              desc: "We meticulously select and craft each product to ensure it meets our stringent quality standards. Every watch, ornament, and cap is made from premium materials and built to last.",
            },
            {
              icon: "◎",
              title: "Seamless Convenience",
              desc: "With our user-friendly interface and hassle-free ordering process, shopping for your favorite accessories has never been easier — from browsing to doorstep delivery.",
            },
            {
              icon: "◉",
              title: "Exceptional Service",
              desc: "Our team is always here to assist you. Whether you have a question about an order or need help choosing the perfect piece, your satisfaction is our top priority.",
            },
            {
              icon: "◐",
              title: "Curated Collections",
              desc: "Every single item in our store is hand-picked by our team. We maintain a tight, intentional catalog — no filler, just pieces we'd wear ourselves.",
            },
            {
              icon: "◑",
              title: "Fast Delivery",
              desc: "Same-day delivery in Dhaka, 2-3 day delivery nationwide. We partner with trusted couriers to ensure your order arrives safe and on time.",
            },
            {
              icon: "◒",
              title: "Easy Returns",
              desc: "Not satisfied? We offer a hassle-free 7-day return policy. No questions asked — because we're confident you'll love what you receive.",
            },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="card-hover p-7 rounded-sm border border-gray-100 bg-white"
                style={{ borderTop: "3px solid #b5936b" }}
              >
                <span className="text-2xl text-amber-600">{c.icon}</span>
                <h3 className="about-display text-gray-800 font-semibold mt-3 mb-2" style={{ fontSize: "1.15rem" }}>
                  {c.title}
                </h3>
                <p className="about-body text-gray-500 font-light leading-relaxed text-sm">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LOCATION MAP */}
      <div className="my-4">
        <LocationMap />
      </div>


    </div>
  );
};

export default About;