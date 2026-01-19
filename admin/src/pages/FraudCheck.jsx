import React, { useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Loader2,
  UserX,
  CheckCircle,
} from "lucide-react";

const FraudCheck = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleCheck = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!bdPhoneRegex.test(phone)) {
      setError("Please enter a valid Bangladeshi mobile number (01XXXXXXXXX)");
      return;
    }

    if (!backendUrl) {
      setError("Backend URL not found in .env file!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/fraud/check`, {
        phone,
      });

      if (response.data) {
        setResult(response.data);
      }
    } catch (err) {
      console.error("Fraud Check Error:", err);
      setError("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-slate-900 p-6 text-center">
          <div className="mx-auto bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck className="text-emerald-400 w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Fraud Detector</h2>
          <p className="text-slate-400 text-sm mt-1">Beigelo Security System</p>
        </div>

        {/* Search Form */}
        <div className="p-6">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-bold bg-gray-100 rounded-l-lg border-r px-2 text-sm">
                  +88
                </span>
                <input
                  type="number"
                  placeholder="17XXXXXXXX"
                  className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? "Analyzing..." : "Check Risk Now"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        {/* Result UI */}
        {result && (
          <div className="border-t border-gray-100 bg-gray-50 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status Card */}
            <div
              className={`flex items-center justify-between p-4 rounded-xl border mb-6 ${
                result.isSafe
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-rose-50 border-rose-100"
              }`}
            >
              <div className="flex items-center gap-3">
                {result.isSafe ? (
                  <CheckCircle className="text-emerald-600 w-8 h-8" />
                ) : (
                  <ShieldAlert className="text-rose-600 w-8 h-8" />
                )}
                <div>
                  <h3
                    className={`font-bold text-lg ${result.isSafe ? "text-emerald-700" : "text-rose-700"}`}
                  >
                    {result.isSafe ? "Safe Customer" : "High Risk Alert"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Risk: {result.risk_level}
                  </p>
                </div>
              </div>
              {/* Success Rate */}
              {result.details && result.details.successRate !== undefined && (
                <div
                  className={`text-2xl font-bold ${result.isSafe ? "text-emerald-700" : "text-rose-700"}`}
                >
                  {result.details.successRate}%
                </div>
              )}
            </div>

            {/* Statistics */}
            {result.details && result.details.total > 0 ? (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Total
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {result.details.total}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Delivered
                  </p>
                  <p className="text-lg font-bold text-emerald-600">
                    {result.details.delivered}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Returned
                  </p>
                  <p className="text-lg font-bold text-rose-600">
                    {result.details.returned}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 bg-white rounded-lg border border-dashed">
                <UserX className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>{result.message || "No previous history found."}</p>
                <p className="text-xs text-blue-500 mt-1">
                  Status: New Customer
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5">
              {result.isSafe ? (
                <button className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm transition-colors">
                  Safe for Cash on Delivery
                </button>
              ) : (
                <button className="w-full py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 shadow-sm animate-pulse transition-colors">
                  ⚠️ Take Advance Payment
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudCheck;
