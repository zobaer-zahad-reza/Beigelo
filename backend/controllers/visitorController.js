import Visitor from "../models/Visitor.js";
import geoip from "geoip-lite";

// ==========================================
// 1. Track New Visitor
// ==========================================
// ==========================================
// 1. Track New Visitor (Fixed Localhost IP Logic)
// ==========================================
export const trackVisitor = async (req, res) => {
  try {
    // 1. Extract Raw IP
    const forwarded = req.headers["x-forwarded-for"];
    let rawIp = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress;

    // Fix: Clean "IPv4 mapped IPv6" format (e.g., ::ffff:127.0.0.1 -> 127.0.0.1)
    if (rawIp && rawIp.startsWith("::ffff:")) {
      rawIp = rawIp.replace("::ffff:", "");
    }
    // Fix: Convert pure IPv6 localhost to IPv4
    if (rawIp === "::1") {
      rawIp = "127.0.0.1";
    }

    // 2. Mock IP for Localhost Testing
    const isLocalhost = rawIp === "127.0.0.1" || rawIp === "localhost";
    const lookupIp = isLocalhost ? "103.155.22.10" : rawIp; // Localhost hole BD IP dhorbo

    // 3. GeoIP Lookup
    const geo = geoip.lookup(lookupIp);

    // 👉 TERMINAL E CHECK KORAR JONNO LOG (Khub important!)
    console.log(
      `[Tracking Check] Raw IP: ${rawIp} | Lookup IP: ${lookupIp} | Country: ${geo?.country || "Not Found"}`,
    );

    // 4. Extract body data
    const { page, userAgent, referrer, utm_source, utm_medium, utm_campaign } =
      req.body;

    // 5. Save to Database
    const newVisitor = await Visitor.create({
      // Database e bujhar subidharthe Local IP hole "127.0.0.1 (Local)" save korbo
      ip: isLocalhost ? "127.0.0.1 (Local)" : rawIp,
      country: geo?.country || "Unknown",
      city: geo?.city || "Unknown",
      source: utm_source || "Direct",
      medium: utm_medium || "-",
      campaign: utm_campaign || "-",
      page: page || req.headers["referer"] || "/",
      referrer: referrer || "direct",
      userAgent: userAgent || req.headers["user-agent"] || "",
    });

    res.status(200).json({
      success: true,
      message: "Visit tracked successfully",
      data: newVisitor,
    });
  } catch (error) {
    console.error("[trackVisitor Error]:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ==========================================
// 2. Get All Visitors (Dashboard er jonno)
// ==========================================
export const getVisitors = async (req, res) => {
  try {
    // Shobcheye notun visitor aage dekhabe
    const visitors = await Visitor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      visitors,
    });
  } catch (error) {
    console.error("[getVisitors Error]:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch visitors" });
  }
};

// ==========================================
// 3. Delete Single Visitor (Dustbin icon er jonno)
// ==========================================
export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    await Visitor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Visitor deleted successfully",
    });
  } catch (error) {
    console.error("[deleteVisitor Error]:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete visitor" });
  }
};

// ==========================================
// 4. Delete All Visitors (Clear All button er jonno)
// ==========================================
export const deleteAllVisitors = async (req, res) => {
  try {
    await Visitor.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All visitors cleared successfully",
    });
  } catch (error) {
    console.error("[deleteAllVisitors Error]:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to clear visitors" });
  }
};
