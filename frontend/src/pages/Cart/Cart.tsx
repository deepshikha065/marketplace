import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, LogoutIcon } from "../../assets/icons/svg";
import CommonButton from "../../components/common/ui/commonButton/CommonButton";
import { ROUTES } from "../../constants/routes";
import api from "../../service/getService";
import { CARTITEMSAPI } from "../../../constant";
import "./Cart.scss";
import Web3 from "web3";
import ContractABI from "../../contract/ContractABI.json";
import { useAppSelector } from "../../redux/app/hooks";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    image: string;
    price: number | string;
  };
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const getCart = async () => {
    try {
      const res = await api.get("/api/v1/cart");
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error("Failed to load cart items:", error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const handleUpdateQuantity = async (
    itemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      await api.put(`${CARTITEMSAPI}${itemId}`, {
        quantity: newQuantity,
      });
      getCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await api.delete(`${CARTITEMSAPI}${itemId}`);
      getCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price =
        typeof item.product.price === "string"
          ? parseFloat(item.product.price.replace("$", ""))
          : item.product.price;

      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const shipping = subtotal > 0 ? 1 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) return;

      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      const res = await api.post("/api/v1/checkout", payload);
      console.log("Checkout response:", res.data);
      setCartItems([]);
      alert("Checkout successful!");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  const contractAddress = "0x3f85aE8A8c760D4c2cEfE6691452aC73d5a11929";

  const merchantAddress = "0x89D3292830107e6abd5b613be1BE80463A091C3D";

  const { account } = useAppSelector((state) => state.wallet)

  const handleCryptoCheckout = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const userAccount = account;

      const contract = new web3.eth.Contract(
        ContractABI,
        contractAddress
      );

      const amountWithDecimals = BigInt(total.toString()) * BigInt(10 ** 18);

      const tx = await contract.methods
        .transfer(merchantAddress, amountWithDecimals)
        .send({ from: userAccount });

      console.log("Payment successful", tx);

      alert("Payment successful!");

      await api.post("/api/v1/checkout", {
        txHash: tx.transactionHash,
        amount: total,
      });
      getCart();
    } catch (error) {
      console.error("Crypto payment failed:", error);
      alert("Payment failed");
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button
          onClick={() => navigate(ROUTES.MARKETPLACE)}
          className="back-btn"
        >
          <ArrowLeftIcon /> Continue Shopping
        </button>
        <h2>My Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <CommonButton
            title="Shop Now"
            onClick={() => navigate(ROUTES.MARKETPLACE)}
          />
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-section">
            <div className="items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-info">
                      <h3>{item.product.name}</h3>
                      <p className="category">
                        Product ID: {item.productId}
                      </p>
                    </div>

                    <div className="item-quantity">
                      <span className="qty-label">Quantity:</span>
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </button>
                        <span className="qty-value">
                          {item.quantity}
                        </span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="item-price-actions">
                    <span className="item-price">
                      $
                      {(
                        (typeof item.product.price === "string"
                          ? parseFloat(
                            item.product.price.replace("$", "")
                          )
                          : item.product.price) * item.quantity
                      ).toFixed(2)}
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <LogoutIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <CommonButton
                title="Proceed to Checkout"
                fluid
                className="checkout-btn"
                onClick={handleCheckout}
              />
              <CommonButton
                title="Pay with Crypto"
                fluid
                className="checkout-btn mt-4"
                onClick={handleCryptoCheckout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
