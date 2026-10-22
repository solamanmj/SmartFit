import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout-container">
      <AdminNavbar />
      <div className="admin-layout-body">
        <AdminSidebar />
        <main className="admin-main-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
