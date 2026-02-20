import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './MainLayout.scss';

import { useAppDispatch } from '../../../redux/app/hooks';
import { fetchCart } from '../../../features/cartSlice';
import Header from '../header/Header';

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
