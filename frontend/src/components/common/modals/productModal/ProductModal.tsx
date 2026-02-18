import { useFormik } from "formik";
import * as Yup from "yup";
import CommonButton from "../../ui/commonButton/CommonButton";
import FormControl from "../../formik/FormControl";
import "./ProductModal.scss";
import { ArrowLeftIcon } from "../../../../assets/icons/svg";
import { useNavigate, useParams } from "react-router-dom";
import { createProductApi, updateProductApi, getProductByIdApi } from "../../../../service/getService";
import { useEffect, useState } from "react";

interface Product {
  id?: string;
  name: string;
  description: string;
  price: string | number;
  image: string;
  itemsAvailable: string | number;
  category: string;
  isPublished: boolean;
  rating?: number;
}

interface ProductModalProps {
  product?: Product;
}

const ProductModal = ({ product: initialProduct }: ProductModalProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(initialProduct || null);

  useEffect(() => {
    if (id && !initialProduct) {
      const fetchProduct = async () => {
        try {
          const data = await getProductByIdApi(id);
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
          alert("Failed to fetch product details");
          navigate(-1);
        }
      };
      fetchProduct();
    }
  }, [id, initialProduct, navigate]);

  const initialValues = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    image: product?.image || "",
    itemsAvailable: product?.itemsAvailable || "",
    category: product?.category || "audio",
    isPublished: product?.isPublished ?? true,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    price: Yup.number()
      .required("Required")
      .positive("Must be positive"),
    image: Yup.string()
      .url("Must be a valid URL")
      .required("Required"),
    itemsAvailable: Yup.number()
      .required("Required")
      .min(0, "Cannot be negative"),
    category: Yup.string().required("Required"),
  });

  const categoryOptions = [
    { value: "audio", label: "Audio" },
    { value: "wearables", label: "Wearables" },
    { value: "photography", label: "Photography" },
    { value: "computers", label: "Computers" },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          ...values,
          price: Number(values.price),
          itemsAvailable: Number(values.itemsAvailable),
          isPublished: Boolean(values.isPublished),
        };

        if (product?.id) {
          await updateProductApi(product.id, payload);
          alert("Product updated successfully");
          navigate(-1);
        } else {
          await createProductApi(payload);
          alert("Product created successfully");
          resetForm();
          navigate(-1);
        }

      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        console.error("Error saving product:", err?.response?.data || error);
        alert(err?.response?.data?.message || "Error saving product");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className=" product-modal">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
          <span>Back to Product</span>
        </button>
      </div>
      <form className="product-form" onSubmit={formik.handleSubmit}>
        <div className="form-grid">

          {/* Product Name */}
          <div className="form-group full-width">
            <label>Product Name</label>
            <FormControl
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter product name"
              error={formik.touched.name && typeof formik.errors.name === 'string' ? formik.errors.name : undefined}
            />
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label>Description</label>
            <FormControl
              control="textarea"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter product description"
              error={formik.touched.description && typeof formik.errors.description === 'string' ? formik.errors.description : undefined}
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price ($)</label>
            <FormControl
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0.00"
              error={formik.touched.price && typeof formik.errors.price === 'string' ? formik.errors.price : undefined}
            />
          </div>

          {/* Items Available */}
          <div className="form-group">
            <label>Available Items</label>
            <FormControl
              type="number"
              name="itemsAvailable"
              value={formik.values.itemsAvailable}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0"
              error={
                formik.touched.itemsAvailable && typeof formik.errors.itemsAvailable === 'string' ? formik.errors.itemsAvailable : undefined
              }
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <FormControl
              control="select"
              name="category"
              options={categoryOptions}
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <FormControl
              control="select"
              name="isPublished"
              options={[
                { value: true, label: "Published" },
                { value: false, label: "Draft" },
              ]}
              value={formik.values.isPublished}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {/* Image */}
          <div className="form-group full-width">
            <label>Image URL</label>
            <FormControl
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="https://example.com/image.jpg"
              error={formik.touched.image && typeof formik.errors.image === 'string' ? formik.errors.image : undefined}
            />
          </div>
        </div>

        <div className="form-actions gap-5">
          <CommonButton
            isLoading={formik.isSubmitting}
            title={product ? "Update Product" : "Create Product"}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default ProductModal;
