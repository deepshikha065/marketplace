import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonButton from '../components/common/ui/commonButton/CommonButton';
import { ArrowLeftIcon, StarIcon, CartIcon } from '../assets/icons/svg';
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../redux/app/hooks';
import { getProductById } from '../features/products/productSlice';
import './ProductDetails.scss';

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProduct: product, isLoading, error } = useAppSelector(state => state.product);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getProductById({ id }));
    }
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <div className="product-details-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="product-details-error">
          <h2>{error || "Product not found"}</h2>
          <button onClick={() => navigate('/marketplace')}>Back to Marketplace</button>
        </div>
      </div>
    );
  }

  const productImage = product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop";
  const productRating = product.rating || 4.5;
  const productCategory = product.category || "General";
  const productFeatures = product.features || [
    "High Quality Build",
    "Premium Performance",
    "Modern Design",
    "1 Year Warranty"
  ];

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
            <img src={productImage} alt={product.name} />
          </div>
          <div className="visual-badges">
            <span className="category-badge">{productCategory}</span>
            <span className="rating-badge">
              <StarIcon fill="#f59e0b" /> {productRating}
            </span>
          </div>
        </div>

        <div className="product-content">
          <div className="main-info">
            <h1>{product.name}</h1>
            <div className="price-tag">${product.price}</div>
          </div>

          <div className="info-section">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="info-section">
            <h3>Key Features</h3>
            <div className="specs-grid">
              {productFeatures.map((feature: string, index: number) => (
                <div key={index} className="spec-item">
                  <span>{feature}</span>
                </div>
              ))}
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
