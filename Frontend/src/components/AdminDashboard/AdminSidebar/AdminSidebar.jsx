import React from "react";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./AdminSidebar.css";

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const menuItems = [
        { icon: "pi pi-users", label: "Gestion Utilisateurs" },
        { icon: "pi pi-folder", label: "Gestion Ressources" },
        { icon: "pi pi-calculator", label: "Gestion Calcul" },
        { icon: "pi pi-cog", label: "Configuration" }
    ];

    return (
        <div className={`sidebar ${isSidebarOpen ? "expanded" : "collapsed"}`}>
            <Button 
                icon={isSidebarOpen ? "pi pi-angle-left" : "pi pi-angle-right"} 
                className="toggle-button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item">
                        <i className={item.icon}></i>
                        {isSidebarOpen && <span className="menu-label">{item.label}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSidebar;
