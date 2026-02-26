import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileIcon, CartIcon, LogoutIcon } from "../../../assets/icons/svg";
import { ROUTES } from "../../../constants/routes";
import { useAppSelector, useAppDispatch } from "../../../redux/app/hooks";
import api from "../../../service/getService";
import CommonButton from ".././ui/commonButton/CommonButton";
import { logOutUser } from "../../../features/userSlice";
import toast from "react-hot-toast";
import { useModal } from "@ebay/nice-modal-react";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { LOGOUT } from "../../../../constant";
import "./Header.scss";


const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user.user);
  const { items: cartItems } = useAppSelector((state) => state.cart);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()


  const AlertModal = useModal("AlertModal");
  const closeAlertModal = useCallback(() => {
    AlertModal.remove();
  }, [AlertModal]);

  const handleLogout = async () => {
    try {
      await api.post(LOGOUT);
      closeAlertModal();
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(logOutUser());
      localStorage.removeItem("persist:root");
      navigate(ROUTES.LOGIN);
      toast.success("Logout successfully");
    }
  };
  const handleDisconnect = async () => {
    await disconnect();
    localStorage.removeItem("wagmi.store");
    toast.success("Wallet disconnected");
  };

  return (
    <header className="main-header">
      <div className="header-left"></div>
      <div className="header-right">
        {user.role !== "ADMIN" && (
          <>
            {!isConnected ? (
              <CommonButton
                title="Connect Wallet"
                onClick={() => connect({ connector: injected() })}
              />
            ) : (
              <>
                <CommonButton
                  title={`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                />
                <CommonButton
                  title="Disconnect"
                  onClick={handleDisconnect}
                />
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

              <button className="dropdown-item logout"
                onClick={() => {
                  AlertModal.show({
                    closeAlertModal,
                    heading: "Are you sure you want to logout?",
                    icon: <LogoutIcon />,
                    // subheading: "Are you sure you want to logout?",
                    leftBtnTitle: "Cancel",
                    onClickLeftBtn: () => { AlertModal.remove(); },
                    rightBtnTitle: "Logout",
                    onClickRightBtn: () => { handleLogout() },
                  });
                }}
              >
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
