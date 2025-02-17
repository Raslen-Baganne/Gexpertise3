import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader/AdminHeader";
import AdminSidebar from "./AdminSidebar/AdminSidebar";
import { Card } from "primereact/card";
import { logout } from "../../services/authService";
import "./AdminDashboard.css";

const AdminDashboard = ({ showNotification }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar fermée par défaut

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          Se déconnecter
        </button>
      </div>
      <div className="dashboard-body">
        <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className={`dashboard-content ${isSidebarOpen ? "shifted" : ""}`}>
          <div className="content">
            <Card title="Bienvenue dans le Dashboard Admin">
              
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
