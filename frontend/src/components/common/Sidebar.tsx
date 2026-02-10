import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, MarketplaceIcon, ProductsIcon } from '../../assets/icons/svg';
import { ROUTES } from '../../constants/routes';
import './Sidebar.scss';
import { useAppSelector } from '../../redux/app/hooks';

const Sidebar: React.FC = () => {
  const { user } = useAppSelector(state => state.user);
  console.log("user", user.user.role);

  if (user.user.role === 'ADMIN') {
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
          <NavLink to={ROUTES.PRODUCTS_INFO} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ProductsIcon />
            <span>Products info</span>
          </NavLink>
        </nav>
      </aside>
    );
  }

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
