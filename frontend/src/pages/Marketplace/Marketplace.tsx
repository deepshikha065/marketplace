import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftArrow, RightArrow, StarIcon } from "../../assets/icons/svg";
import FormControl from "../../components/common/formik/FormControl";
import { ROUTES } from "../../constants/routes";
import api from "../../service/getService";
import AddToCartBtn from "../../components/common/addToCartBtn/AddToCartBtn";
import useDebounce from "../../hooks/useDebounce";
import { PRODUCTSAPI } from "../../../constant";
import "./Marketplace.scss";

interface Product {
  id: string | number;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  image: string;
  createdAt?: string;
}

const Marketplace: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8);

  const debouncedSearch = useDebounce(search, 500);

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "sports", label: "Sports" },
    { value: "furniture", label: "Furniture" },
  ];

  const sortOptions = [
    { value: "default", label: "Sort By" },
    { value: "low-high", label: "Price: Low to High" },
    { value: "high-low", label: "Price: High to Low" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(PRODUCTSAPI, {
          params: {
            page,
            limit,
            search: debouncedSearch,
            category: category !== "all" ? category : undefined,
            sort: sortOrder !== "default" ? sortOrder : undefined,
          },
        });

        setProducts(response.data.products || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [page, limit, debouncedSearch, category, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sortOrder]);

  const openDetails = (productId: string | number) => {
    navigate(ROUTES.PRODUCT_DETAILS.replace(":id", productId.toString()));
  };

  return (
    <div className="marketplace-page">
      <div className="marketplace-header">
        <div className="header-left">
          <h1 className="h2">Marketplace</h1>
          <p>Explore our curated collection of premium products</p>
        </div>

        <div className="header-actions">
          <div className="search-wrapper">
            <FormControl
              name="search"
              placeholder="Search products..."
              className="marketplace-search"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <FormControl
            control="select"
            name="category"
            options={categoryOptions}
            value={category}
            className="marketplace-select"
            onChange={(value: string) => setCategory(value || "all")}
          />

          <FormControl
            control="select"
            name="sort"
            options={sortOptions}
            value={sortOrder}
            className="marketplace-select"
            onChange={(value: string) => setSortOrder(value || "default")}
          />
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="products-grid">
        {products.map((product) => (
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
                <span className="price">₹{product.price}</span>
              </div>

              <p className="description">{product.description}</p>

              <div className="product-actions">
                <button
                  className="view-details-btn"
                  onClick={() => openDetails(product.id)}
                >
                  View Details
                </button>

                <AddToCartBtn productId={product.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <LeftArrow />
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          > 
            <RightArrow />
          </button>
        </div>
      )}

      {products.length === 0 && (
        <div className="empty-state">No products found.</div>
      )}
    </div>
  );
};

export default Marketplace;