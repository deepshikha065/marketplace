import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../../constants/mockProducts';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import { ArrowLeftIcon, LogoutIcon } from '../../assets/icons/svg';
import { ROUTES } from '../../constants/routes';
import './Cart.scss';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = React.useState([
    { ...MOCK_PRODUCTS[0], quantity: 1 },
    { ...MOCK_PRODUCTS[1], quantity: 2 },
  ]);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return acc + (price * item.quantity);
  }, 0);

  const shipping = 15.00;
  const total = subtotal + shipping;

  const handleIncreaseItem = (itemId: string | number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseItem = (itemId: string | number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate(ROUTES.MARKETPLACE)}>
          <ArrowLeftIcon />
          <span>Continue Shopping</span>
        </button>
        <h2 >My Cart</h2>
      </div>

      <div className="cart-container">
        <div className="cart-items-section">
          <div className="items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="category">{item.category}</p>
                  </div>
                  <div className="item-quantity">
                    <span className="qty-label">Quantity:</span>
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => handleDecreaseItem(item.id)}
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleIncreaseItem(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="item-price-actions">
                  <span className="item-price">{item.price}</span>
                  <button className="remove-btn" title="Remove">
                    <LogoutIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span className="label">Subtotal</span>
              <span className="value">${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="label">Shipping</span>
              <span className="value">${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span className="label">Total</span>
              <span className="value">${total.toFixed(2)}</span>
            </div>
            <CommonButton
              title="Proceed to Checkout"
              fluid
              className="checkout-btn"
              onClick={() => console.log('Checkout clicked')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
