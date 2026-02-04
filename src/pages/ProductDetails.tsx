import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonButton from '../components/common/ui/commonButton/CommonButton';
import { ArrowLeftIcon, StarIcon, CartIcon } from '../assets/icons/svg';
import './ProductDetails.scss';

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();


  return (
    <div className="product-details-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
          <span>Back to Marketplace</span>
        </button>
      </div>

      <div className="product-details-container">
        <div className="product-visual">
          <div className="image-wrapper">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop" />
          </div>
          <div className="visual-badges">
            <span className="category-badge">Audio</span>
            <span className="rating-badge">
              <StarIcon fill="#f59e0b" /> 4.5
            </span>
          </div>
        </div>

        <div className="product-content">
          <div className="main-info">
            <h2>Quantum Fusion Headphones</h2>
            <div className="price-tag">$299.99</div>
          </div>

          <div className="info-section">
            <h3>Description</h3>
            <p>Immerse yourself in pure sound with Quantum Fusion Headphones. Featuring active noise cancellation, 40-hour battery life, and crystal-clear audio quality.</p>
          </div>

          <div className="info-section">
            <h3>Key Features</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span>Active Noise Cancellation</span>
              </div>
              <div className="spec-item">
                <span>40-Hour Battery Life</span>
              </div>
              <div className="spec-item">
                <span>Bluetooth 5.2</span>
              </div>
              <div className="spec-item">
                <span>Premium Comfort Fit</span>
              </div>
            </div>
          </div>

          <div className="action-section">
            <CommonButton
              title="Add to Cart"
              svgIcon={<CartIcon />}
              fluid
              className="add-to-cart-btn"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
