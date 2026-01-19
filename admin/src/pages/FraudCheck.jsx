import React, { useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Loader2,
  CheckCircle,
  Truck,
  Box,
  XCircle,
  UserX,
  LayoutDashboard,
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
      setError("Please enter a valid Bangladeshi mobile number");
      return;
    }

    if (!backendUrl) {
      setError("Backend URL missing");
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
      console.error("Error:", err);
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  // Pie Chart Component
  const CircularProgress = ({ value, color }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-36 h-36">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <span className="block text-3xl font-bold text-gray-700">
            {value}%
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Success
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* Full Width Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-3 rounded-xl">
              <ShieldCheck className="text-emerald-400 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Fraud Detector
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Beigelo Intelligence System
              </p>
            </div>
          </div>

          {/* Search Bar in Header */}
          <form onSubmit={handleCheck} className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1 md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-bold bg-gray-100 rounded-l-lg border-r border-gray-200 px-3 text-sm">
                +88
              </span>
              <input
                type="number"
                placeholder="017XXXXXXXX"
                className="w-full pl-20 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-lg shadow-slate-200 transition-all flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span className="hidden md:inline">Check</span>
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 animate-pulse">
            <ShieldAlert className="w-5 h-5" /> {error}
          </div>
        )}

        {/* Dashboard Content */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status & Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status Card */}
              <div
                className={`p-8 rounded-2xl border-2 text-center shadow-sm ${
                  result.isSafe
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-rose-50 border-rose-100"
                }`}
              >
                {result.isSafe ? (
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                ) : (
                  <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                )}
                <h2
                  className={`text-2xl font-bold mb-1 ${result.isSafe ? "text-emerald-800" : "text-rose-800"}`}
                >
                  {result.isSafe ? "Safe Customer" : "High Risk Customer"}
                </h2>
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest">
                  Risk Level: {result.risk_level}
                </p>

                <button
                  className={`w-full mt-6 py-3 rounded-xl text-white font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                    result.isSafe
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {result.isSafe ? "Safe for COD" : "Take Advance"}
                </button>
              </div>

              {/* Big Stats */}
              {result.details && result.details.total > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center">
                  <h3 className="text-gray-400 font-bold text-xs uppercase mb-4">
                    Overall Performance
                  </h3>
                  <CircularProgress
                    value={result.details.successRate}
                    color={result.isSafe ? "#10b981" : "#f43f5e"}
                  />

                  <div className="grid grid-cols-3 gap-4 w-full mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-800">
                        {result.details.total}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">
                        Total
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        {result.details.delivered}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">
                        Success
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rose-600">
                        {result.details.returned}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">
                        Return
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Table */}
            <div className="lg:col-span-2">
              {result.couriers && result.couriers.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-slate-400" />
                      Courier Breakdown
                    </h3>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {result.couriers.length} Couriers Found
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                          <th className="px-6 py-4">Courier Name</th>
                          <th className="px-6 py-4 text-center">
                            Total Parcel
                          </th>
                          <th className="px-6 py-4 text-center">Delivered</th>
                          <th className="px-6 py-4 text-right">Return Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {result.couriers.map((courier, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-50 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {/* LOGO DISPLAY LOGIC */}
                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center p-1 overflow-hidden">
                                  {courier.logo ? (
                                    <img
                                      src={courier.logo}
                                      alt={courier.name}
                                      className="w-full h-full object-contain mix-blend-multiply"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                          "block";
                                      }}
                                    />
                                  ) : null}
                                  {/* Fallback Icon if no logo or error */}
                                  <Truck
                                    className={`w-5 h-5 text-gray-300 ${courier.logo ? "hidden" : "block"}`}
                                  />
                                </div>
                                <span className="font-bold text-slate-700 group-hover:text-slate-900">
                                  {courier.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="px-3 py-1 bg-gray-100 rounded-md font-bold text-gray-600 text-sm">
                                {courier.total}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-bold text-emerald-600">
                                {courier.delivered}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${courier.returnRate > 10 ? "bg-rose-500" : "bg-emerald-500"}`}
                                    style={{
                                      width: `${Math.min(courier.returnRate, 100)}%`,
                                    }}
                                  ></div>
                                </div>
                                <span
                                  className={`text-sm font-bold ${courier.returnRate > 10 ? "text-rose-600" : "text-emerald-600"}`}
                                >
                                  {courier.returnRate}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // No History State
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 h-full flex flex-col items-center justify-center p-10 text-center">
                  <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <UserX className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">
                    No History Found
                  </h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">
                    This phone number has no previous delivery records in the
                    database.
                  </p>
                  <span className="mt-4 px-4 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full">
                    New Customer
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudCheck;
