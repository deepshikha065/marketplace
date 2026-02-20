import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileIcon, CartIcon, LogoutIcon } from "../../../assets/icons/svg";
import { ROUTES } from "../../../constants/routes";
import { useAppSelector, useAppDispatch } from "../../../redux/app/hooks";
import api from "../../../service/getService";
import CommonButton from ".././ui/commonButton/CommonButton";
import { setAccount } from "../../../features/WalletSlice";
import { logOutUser } from "../../../features/userSlice";
import toast from "react-hot-toast";
import "./Header.scss";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<string[]>;
    };
  }
}

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user.user);
  const account = useAppSelector((state) => state.wallet.account) || "";
  const { items: cartItems } = useAppSelector((state) => state.cart);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed");
        return;
      }

      const existingAccounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (existingAccounts.length > 0) {
        dispatch(setAccount(existingAccounts[0]));
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      dispatch(setAccount(accounts[0]));
    } catch (error) {
      console.error("User rejected connection:", error);
    }
  };

  const disconnectWallet = () => {
    dispatch(setAccount(null));
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(logOutUser());
      localStorage.removeItem("persist:root");
      navigate(ROUTES.LOGIN);
      toast.success("Logout successfully");
    }
  };

  return (
    <header className="main-header">
      <div className="header-left"></div>
      <div className="header-right">
        {user.role !== "ADMIN" && (
          <>
            {!account ? (
              <CommonButton title="Connect Wallet" onClick={connectWallet} />
            ) : (
              <>
                <CommonButton
                  title={`${account.slice(0, 6)}...${account.slice(-4)}`}
                // title={account}
                />
                <CommonButton title="Disconnect" onClick={disconnectWallet} />
              </>
            )}
          </>
        )}

        <button
          className="icon-btn"
          title="Cart"
          onClick={() => navigate(ROUTES.CART)}
        >
          <CartIcon />
          {cartItems.length > 0 && (
            <span className="badge">{cartItems.length}</span>
          )}
        </button>

        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button
            className={`icon-btn profile-btn ${isDropdownOpen ? "active" : ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Profile"
          >
            <ProfileIcon />
          </button>

          {isDropdownOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-header">
                <div className="user-avatar">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
              </div>

              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate(ROUTES.PROFILE);
                  setIsDropdownOpen(false);
                }}
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
