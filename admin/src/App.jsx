import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import AddBrand from "./pages/AddBrand";
import DashboardHome from "./pages/DashboardHome";
import FraudCheck from "./pages/FraudCheck";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "৳ ";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} backendUrl={backendUrl} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                {/* Default Route */}

                <Route
                  path="/add"
                  element={
                    <Add
                      token={token}
                      backendUrl={backendUrl}
                      currency={currency}
                    />
                  }
                />

                <Route index element={<DashboardHome />} />
                <Route path="/dashboard" element={<DashboardHome />}/>

                <Route path="/fraudCheck" element={<FraudCheck />}/>


                <Route
                  path="/list"
                  element={
                    <List
                      token={token}
                      backendUrl={backendUrl}
                      currency={currency}
                    />
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <Orders
                      token={token}
                      backendUrl={backendUrl}
                      currency={currency}
                    />
                  }
                />
                <Route
                  path="/add-brand"
                  element={<AddBrand token={token} backendUrl={backendUrl} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
