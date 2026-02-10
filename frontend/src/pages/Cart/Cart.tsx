import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, LogoutIcon } from "../../assets/icons/svg";
import CommonButton from "../../components/common/ui/commonButton/CommonButton";
import { ROUTES } from "../../constants/routes";
import "./Cart.scss";
import api from "../../service/getService";

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
      await api.put(`/api/v1/cart/items/${itemId}`, {
        quantity: newQuantity,
      });
      getCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await api.delete(`/api/v1/cart/items/${itemId}`);
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

  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    alert("Checkout successful!");
    setCartItems([]);
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
