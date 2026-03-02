import Visitor from "../models/Visitor.js";
import geoip from "geoip-lite";

export const trackVisitor = async (req, res) => {
  try {
    const { utm_source, utm_medium, utm_campaign, page, referrer } = req.body;


    const rawIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress;
    const ip = rawIp === "::1" || rawIp === "127.0.0.1" ? "8.8.8.8" : rawIp;

    const geo = geoip.lookup(ip);


    let finalSource = utm_source || "Direct";

    if (finalSource === "Direct" && referrer) {
      if (referrer.includes("facebook.com")) finalSource = "Facebook";
      else if (referrer.includes("google.com")) finalSource = "Google";
      else if (referrer.includes("instagram.com")) finalSource = "Instagram";
      else if (referrer.includes("youtube.com")) finalSource = "YouTube";
      else finalSource = referrer;
    }

    await Visitor.create({
      ip: rawIp, 
      country: geo?.country || "Unknown",
      city: geo?.city || "Unknown",  
      source: finalSource,
      medium: utm_medium || "-",
      campaign: utm_campaign || "-",
      page: page || "/",
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({ success: true, message: "Visitor Tracked Successfully" });
  } catch (error) {
    console.error("Tracking Error:", error.message);
    res.status(500).json({ success: false, message: "Tracking Failed" });
  }
};

export const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVisitor = await Visitor.findByIdAndDelete(id);

    if (!deletedVisitor) {
      return res.status(404).json({ success: false, message: "Visitor not found" });
    }

    res.status(200).json({ success: true, message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllVisitors = async (req, res) => {
  try {
    await Visitor.deleteMany({});
    res.status(200).json({ success: true, message: "All visitors deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};