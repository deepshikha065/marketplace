import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.scss';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-logo">
            <h1>MarketPlace</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
