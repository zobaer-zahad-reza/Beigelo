import axios from "axios";

export const checkFraudRisk = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.FRAUDBD_API_KEY,
      },
    };

    const apiResponse = await axios.post(
      "https://fraudbd.com/api/check-courier-info",
      { phone_number: phone },
      config,
    );

    const apiData = apiResponse.data;

    if (apiData && apiData.status === true && apiData.data) {
      const fraudData = apiData.data;
      const summariesObj = fraudData.Summaries || {};

      // Courier Data Processing
      const formattedCouriers = Object.keys(summariesObj).map((key) => {
        const item = summariesObj[key];

        const cTotal = Number(item.total || 0);
        const cDelivered = Number(item.success || 0);
        const cCancel = Number(item.cancel || 0);

        // Return Rate Calculation
        const returnRate =
          cTotal > 0 ? ((cCancel / cTotal) * 100).toFixed(1) : 0;

        return {
          name: key,
          logo: item.logo || null,
          total: cTotal,
          delivered: cDelivered,
          returned: cCancel,
          returnRate: returnRate,
        };
      });

      // Recalculate Totals (Manually)

      const finalTotal = formattedCouriers.reduce(
        (sum, item) => sum + item.total,
        0,
      );
      const finalDelivered = formattedCouriers.reduce(
        (sum, item) => sum + item.delivered,
        0,
      );
      const finalReturned = formattedCouriers.reduce(
        (sum, item) => sum + item.returned,
        0,
      );

      // Success Rate Calculation
      const finalSuccessRate =
        finalTotal > 0 ? Math.round((finalDelivered / finalTotal) * 100) : 0;

      // Risk Logic
      let isSafe = true;
      let riskLevel = "Low";

      if (finalTotal > 0 && finalSuccessRate < 60) {
        isSafe = false;
        riskLevel = "High";
      }

      return res.json({
        isSafe: isSafe,
        risk_level: riskLevel,
        details: {
          total: finalTotal,
          delivered: finalDelivered,
          returned: finalReturned,
          successRate: finalSuccessRate,
        },
        couriers: formattedCouriers,
      });
    } else {
      return res.json({
        isSafe: true,
        risk_level: "New",
        message: "No previous history found.",
        details: { total: 0, delivered: 0, returned: 0, successRate: 0 },
        couriers: [],
      });
    }
  } catch (error) {
    console.error("Fraud API Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to verify fraud status.",
      error: error.message,
    });
  }
};
