import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.scss';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="layout-content">
        <Header />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
