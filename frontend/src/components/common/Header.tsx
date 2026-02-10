import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileIcon, CartIcon, LogoutIcon } from '../../assets/icons/svg';
import { ROUTES } from '../../constants/routes';
import './Header.scss';
import { useAppSelector, useAppDispatch } from '../../redux/app/hooks';
import { logOutUser } from '../../features/user/userSlice';
import api from '../../service/getService';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      dispatch(logOutUser());
      localStorage.removeItem('persist:root'); // Clear persisted state
      alert('Logout successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.log(error);
      dispatch(logOutUser()); // Still logout on error if API fails
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <header className="main-header">
      <div className="header-left">
      </div>
      <div className="header-right">
        <button className="icon-btn" title="Cart" onClick={() => navigate(ROUTES.CART)}>
          <CartIcon />
          <span className="badge">2</span>
        </button>
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button
            className={`icon-btn profile-btn ${isDropdownOpen ? 'active' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Profile"
          >
            <ProfileIcon />
          </button>
          {isDropdownOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-header">
                <div className="user-avatar">AU</div>
                <div className="user-info">
                  <span className="user-name">{user.user.name}</span>
                  <span className="user-email">{user.user.email}</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={() => { navigate(ROUTES.PROFILE); setIsDropdownOpen(false); }}
              >
                <ProfileIcon />
                <span>View Profile</span>
              </button>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
