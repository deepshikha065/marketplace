import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.scss';

import { useAppDispatch } from '../../redux/app/hooks';
import { fetchCart } from '../../features/cartSlice';

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

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
