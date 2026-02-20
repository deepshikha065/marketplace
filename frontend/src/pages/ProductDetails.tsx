import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon } from '../assets/icons/svg';
import api from '../service/getService';
import AddToCartBtn from '../components/common/addToCartBtn/AddToCartBtn';
import { PRODUCTSAPI } from '../../constant';
import './ProductDetails.scss';

interface Product {
  id: string | number;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  image: string;
}

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productData, setProductData] = React.useState<Product | null>(null);

  React.useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`${PRODUCTSAPI}${id}`);
          setProductData(response.data);
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
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
            <img src={productData?.image} alt={productData?.name} />
          </div>
          <div className="visual-badges">
            <span className="category-badge">{productData?.category}</span>
            <span className="rating-badge">
              <StarIcon fill="#f59e0b" /> {productData?.rating || 0}
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
            {productData?.id && <AddToCartBtn productId={productData.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
