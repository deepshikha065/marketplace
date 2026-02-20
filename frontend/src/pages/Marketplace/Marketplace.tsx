import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "../../assets/icons/svg";
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

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const debouncedSearch = useDebounce(search, 1000);

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
        const response = await api.get(PRODUCTSAPI);
        setAllProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const searchText = debouncedSearch.toLowerCase();

      const matchesSearch =
        product.name?.toLowerCase().includes(searchText) ||
        product.description?.toLowerCase().includes(searchText) ||
        product.category?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "all" ||
        product.category?.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortOrder === "low-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [allProducts, debouncedSearch, category, sortOrder]);

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
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
      <div className="products-grid">
        {filteredProducts.map((product) => (
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

      {filteredProducts.length === 0 && (
        <div className="empty-state">No products found.</div>
      )}
    </div>
  );
};

export default Marketplace;
