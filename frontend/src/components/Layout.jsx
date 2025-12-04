import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBox,
  FaTachometerAlt,
  FaBoxOpen,
  FaTruck,
  FaWallet,
  FaUsers,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Layout.css";

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const userLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/book-shipment", label: "Book Shipment", icon: <FaBoxOpen /> },
    { path: "/shipments", label: "My Shipments", icon: <FaTruck /> },
    { path: "/wallet", label: "Wallet", icon: <FaWallet /> },
  ];

  const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/users", label: "Users", icon: <FaUsers /> },
    { path: "/admin/shipments", label: "Shipments", icon: <FaTruck /> },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <FaBox className="sidebar-logo-icon" />
          <h2>Aid Express</h2>
        </div>
        <nav className="sidebar-nav">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? "active" : ""}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              {user?.role === "admin" && (
                <span className="admin-badge">Admin</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary logout-btn"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
