import Visitor from "../models/Visitor.js";
import geoip from "geoip-lite";

const resolveIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress;
  return raw === "::1" || raw === "127.0.0.1" ? "8.8.8.8" : raw;
};

const inferSource = (utmSource, referrer = "") => {
  if (utmSource) return utmSource;
  if (!referrer || referrer === "direct") return "Direct";
  const ref = referrer.toLowerCase();
  if (ref.includes("google.")) return "Google";
  if (ref.includes("facebook.") || ref.includes("fb.")) return "Facebook";
  if (ref.includes("instagram.")) return "Instagram";
  if (ref.includes("youtube.")) return "YouTube";
  if (ref.includes("twitter.") || ref.includes("t.co")) return "Twitter";
  if (ref.includes("linkedin.")) return "LinkedIn";
  if (ref.includes("bing.")) return "Bing";
  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer;
  }
};

export const trackVisitor = async (req, res) => {
  try {
    const { utm_source, utm_medium, utm_campaign, page, referrer } = req.body;

    const ip = resolveIp(req);
    const geo = geoip.lookup(ip);

    await Visitor.create({
      ip,
      country: geo?.country || "Unknown",
      city: geo?.city || "Unknown",
      source: inferSource(utm_source, referrer),
      medium: utm_medium || "-",
      campaign: utm_campaign || "-",
      page: page || "/",
      referrer: referrer || "direct",
      userAgent: req.headers["user-agent"] || "",
    });

    res
      .status(201)
      .json({ success: true, message: "Visitor tracked successfully" });
  } catch (error) {
    console.error("[trackVisitor]", error.message);
    res.status(500).json({ success: false, message: "Tracking failed" });
  }
};

export const getVisitors = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 500, 2000);
    const visitors = await Visitor.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ success: true, visitors });
  } catch (error) {
    console.error("[getVisitors]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[a-f\d]{24}$/i)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid visitor ID" });
    }

    const deleted = await Visitor.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    res.json({ success: true, message: "Visitor deleted" });
  } catch (error) {
    console.error("[deleteVisitor]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete all visitors
export const deleteAllVisitors = async (req, res) => {
  try {
    const result = await Visitor.deleteMany({});
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} visitor(s)`,
    });
  } catch (error) {
    console.error("[deleteAllVisitors]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get stats summary
export const getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, todayCount, uniqueIPs] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ createdAt: { $gte: today } }),
      Visitor.distinct("ip").then((ips) => ips.length),
    ]);

    res.json({ success: true, total, todayCount, uniqueIPs });
  } catch (error) {
    console.error("[getStats]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
