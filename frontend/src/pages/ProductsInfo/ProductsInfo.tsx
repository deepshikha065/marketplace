import  { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditIcon, TrashIcon, PlusIcon, StarIcon } from '../../assets/icons/svg';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import api from '../../service/getService';
import { ROUTES } from '../../constants/routes';
import { useModal } from '@ebay/nice-modal-react';
import { ADMINPRODUCTSAPI, PRODUCTSAPI } from '../../../constant';
import toast from 'react-hot-toast';
import './ProductsInfo.scss';

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
  const [products, setProducts] = useState<Product[]>([]);

  const AlertModal = useModal("AlertModal");
  const closeAlertModal = useCallback(() => {
    AlertModal.remove();
  }, [AlertModal]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(PRODUCTSAPI);
        const data = response.data.products;
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`${ADMINPRODUCTSAPI}${id}`);
      console.log('Product deleted:', res.data);
      toast.success('Product deleted successfully');
      closeAlertModal();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
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
                    <button className="icon-btn delete"
                      title="Delete"
                      onClick={() => {
                        AlertModal.show({
                          closeAlertModal,
                          heading: "Are you sure?",
                          subheading: "Are you sure you want to delete this product?",
                          leftBtnTitle: "Cancel",
                          onClickLeftBtn: () => { AlertModal.remove(); },
                          rightBtnTitle: "Delete",
                          onClickRightBtn: () => { handleDelete(product.id) },
                        });
                      }}
                    >
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
