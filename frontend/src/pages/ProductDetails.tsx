import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon } from '../assets/icons/svg';
import './ProductDetails.scss';
import api from '../service/getService';
import AddToCartBtn from '../components/common/addToCartBtn/AddToCartBtn';

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productData, setProductData] = React.useState<any>(null);

  React.useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const response = await api.get(`/api/v1/products/${id}`);
        setProductData(response.data);
      };
      fetchProduct();
    }
  }, [id]);

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

            <img src={productData?.image} />
          </div>
          <div className="visual-badges">
            <span className="category-badge">{productData?.category}</span>
            <span className="rating-badge">
              <StarIcon fill="#f59e0b" /> 4
            </span>
          </div>
        </div>

        <div className="product-content">
          <div className="main-info">
            <h1>{productData?.name}</h1>
            <div className="price-tag">${productData?.price}</div>
          </div>

          <div className="info-section">
            <h3>Description</h3>
            <p>{productData?.description}</p>
          </div>
          <div className="action-section">
            <AddToCartBtn productId={productData?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
