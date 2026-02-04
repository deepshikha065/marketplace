import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, MarketplaceIcon } from '../../assets/icons/svg';
import { ROUTES } from '../../constants/routes';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  return (
    <aside className="main-sidebar">
      <div className="sidebar-logo">
        <h2>MarketPlace</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to={ROUTES.DASHBOARD} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <DashboardIcon />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to={ROUTES.MARKETPLACE} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MarketplaceIcon />
          <span>Marketplace</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
