import Visitor from "../models/Visitor.js";
import geoip from "geoip-lite";

export const trackVisitor = async (req, res) => {
  try {
    const { utm_source, utm_medium, utm_campaign, page, referrer } = req.body;

    // IP Address বের করা
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);

    // সোর্স ডিটেকশন লজিক (UTM না থাকলে Referrer চেক করবে)
    let finalSource = utm_source || "Direct";

    // যদি UTM না থাকে, কিন্তু Referrer থাকে, তাহলে সেটা চেক করে সোর্স বসাবে
    if (finalSource === "Direct" && referrer) {
      if (referrer.includes("facebook.com")) finalSource = "Facebook";
      else if (referrer.includes("google.com")) finalSource = "Google";
      else if (referrer.includes("instagram.com")) finalSource = "Instagram";
      else if (referrer.includes("youtube.com")) finalSource = "YouTube";
      else finalSource = referrer; // অন্য কোনো ওয়েবসাইট হলে
    }

    await Visitor.create({
      ip,
      country: geo?.country || "Unknown",
      city: geo?.city || "Unknown",
      source: finalSource,
      medium: utm_medium || "-",
      campaign: utm_campaign || "-",
      page: page || "/",
      userAgent: req.headers["user-agent"],
    });

    res
      .status(200)
      .json({ success: true, message: "Visitor Tracked Successfully" });
  } catch (error) {
    console.error("Tracking Error:", error.message);
    res.status(500).json({ success: false, message: "Tracking Failed" });
  }
};

export const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// নির্দিষ্ট একটি ভিজিটর ডিলিট করার জন্য
export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params; // রাউট থেকে ID নেওয়া হবে
    const deletedVisitor = await Visitor.findByIdAndDelete(id);

    if (!deletedVisitor) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
