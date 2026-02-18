import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditIcon, TrashIcon, PlusIcon, StarIcon } from '../../assets/icons/svg';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import api from '../../service/getService';
import './ProductsInfo.scss';
import { ROUTES } from '../../constants/routes';

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  itemsAvailable: number;
  isPublished: boolean;
  rating?: number;
}

const ProductsInfo = () => {

  const navigate = useNavigate();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [refresh, setRefresh] = React.useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/v1/products');
        const data = response.data.products;
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await api.delete(`/api/v1/admin/products/${id}`);
        console.log('Product deleted:', res.data);
        alert('Product deleted successfully');
        setRefresh(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="products-info-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Products Management</h1>
          <p>Create, update and manage your marketplace products</p>
        </div>
        <CommonButton
          title="Add New Product"
          svgIcon={<PlusIcon />}
          className="add-product-btn small_btn"
          to={ROUTES.ADD_PRODUCT}
          role='link'
        />
      </div>
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <img src={product.image} alt={product.name} className="product-thumb" />
                    <div className="product-details">
                      <span className="product-name">{product.name}</span>
                      <div className="product-rating">
                        <StarIcon fill="#f59e0b" />
                        <span>{product.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="category-tag">{product.category}</span>
                </td>
                <td>
                  <span className="product-price">${product.price}</span>
                </td>
                <td>
                  <span className={`stock-status ${product.itemsAvailable > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.itemsAvailable} available
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${product.isPublished ? 'published' : 'draft'}`}>
                    {product.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="icon-btn edit"
                      title="Edit"
                      onClick={() => navigate(ROUTES.EDIT_PRODUCT.replace(':id', product.id))}
                    >
                      <EditIcon />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(product.id)} title="Delete">
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="no-data">No products found. Add your first product!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsInfo;
