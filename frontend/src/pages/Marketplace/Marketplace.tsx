import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterIcon, StarIcon, CartIcon } from '../../assets/icons/svg';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import FormControl from '../../components/common/formik/FormControl';
import { ROUTES } from '../../constants/routes';
import { getProducts } from '../../features/products/productSlice';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import './Marketplace.scss';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const selector = useAppSelector((state) => state.product.products);
  const openDetails = (productId: string) => {
    navigate(ROUTES.PRODUCT_DETAILS.replace(':id', productId.toString()));
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'audio', label: 'Audio' },
    { value: 'wearables', label: 'Wearables' },
    { value: 'photography', label: 'Photography' },
    { value: 'computers', label: 'Computers' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="marketplace-page">
      <div className="marketplace-header">
        <div className="header-left">
          <h1 className="h2">Marketplace</h1>
          <p>Explore our curated collection of premium tech products</p>
        </div>
        <div className="header-actions">
          <div className="search-wrapper">
            <FormControl
              name="search"
              placeholder="Search products..."
              className="marketplace-search"
            />
          </div>
          <div className="filter-group">
            <FormControl
              control="select"
              name="category"
              options={categoryOptions}
              value="all"
              className="marketplace-select"
            />
            <FormControl
              control="select"
              name="sort"
              options={sortOptions}
              value="recent"
              className="marketplace-select"
            />
            <CommonButton
              title="Filters"
              svgIcon={<FilterIcon />}
            />
          </div>
        </div>
      </div>
      <div>
      </div>
      <div className="products-grid">
        {selector.map((product: any) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="category-badge">{product.category}</div>
              <div className="rating-badge">
                <StarIcon fill="#f59e0b" />
                <span>{product.rating}</span>
              </div>
            </div>
            <div className="product-info">
              <div className="name-price">
                <h3>{product.name}</h3>
                <span className="price">{product.price}</span>
              </div>
              <p className="description">{product.description}</p>
              <div className="product-actions">
                <button
                  className="view-details-btn"
                  onClick={() => openDetails(product.id)}
                >
                  View Details
                </button>
                <CommonButton
                  title="Add to Cart"
                  svgIcon={<CartIcon />}
                  className="add-to-cart-btn"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
