import React, { useEffect, useState } from 'react';
import { EditIcon, TrashIcon, PlusIcon, StarIcon } from '../../assets/icons/svg';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import { getProductsApi, deleteProductApi } from '../../service/getService';
import NiceModal from '@ebay/nice-modal-react';
import ProductModal from '../../components/common/modals/productModal/ProductModal';
import './ProductsInfo.scss';

const ProductsInfo: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getProductsApi();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductApi(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product: any) => {
    NiceModal.show(ProductModal, {
      product,
      onSuccess: fetchProducts
    });
  };

  const handleAdd = () => {
    NiceModal.show(ProductModal, {
      onSuccess: fetchProducts
    });
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
          className="add-product-btn"
          onClick={handleAdd}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading products...</div>
      ) : (
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
              {products.map((product: any) => (
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
                      <button className="icon-btn edit" onClick={() => handleEdit(product)} title="Edit">
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
      )}
    </div>
  );
};

export default ProductsInfo;
