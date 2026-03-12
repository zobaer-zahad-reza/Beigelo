import Visitor from "../models/Visitor.js";
import geoip from "geoip-lite";

const SKIP_PATHS = /\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf|map)$/i;

const trackVisitor = async (req, res, next) => {
  next();

  if (SKIP_PATHS.test(req.path) || req.path === "/health") return;

  try {
    const forwarded = req.headers["x-forwarded-for"];
    const rawIp = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress;

    const ip = rawIp === "::1" || rawIp === "127.0.0.1" ? "8.8.8.8" : rawIp;
    const geo = geoip.lookup(ip);

    const { utm_source, utm_medium, utm_campaign } = req.query;

    await Visitor.create({
      ip: rawIp,
      country: geo?.country || "Unknown",
      city: geo?.city || "Unknown",
      source: utm_source || "Direct",
      medium: utm_medium || "-",
      campaign: utm_campaign || "-",
      page: req.originalUrl,
      referrer: req.headers["referer"] || req.headers["referrer"] || "direct",
      userAgent: req.headers["user-agent"] || "",
    });
  } catch (error) {
    console.warn("[trackVisitor middleware]", error.message);
  }
};

export default trackVisitor;
