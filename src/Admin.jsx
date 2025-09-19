import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Component/AdminDashboardComponent/Sidebar";
import { jwtDecode } from "jwt-decode";

function Admin() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const token = localStorage.getItem("token"); // Ensure correct key
      if (token) {
        const decoded = jwtDecode(token);
        const adminTags = ["SubAdmin", "SuperAdmin"];
        if (decoded.role && !adminTags.includes(decoded.role)) {
          navigate("/admin-login");
        }
      } else {
        navigate("/admin-login");
      }
    } catch (error) {
      navigate("/admin-login");
      throw error;
    }
  }, [navigate]);

  return (
    <>
      <div className="w-full min-h-screen flex ">
        <Sidebar />
        <div className="flex-1 md:ml-0 overflow-x-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Admin;
