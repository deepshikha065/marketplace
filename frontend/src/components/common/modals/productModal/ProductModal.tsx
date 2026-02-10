import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CommonButton from "../../ui/commonButton/CommonButton";
import CommonModal from "../CommonModal";
import FormControl from "../../formik/FormControl";
import { createProductApi, updateProductApi } from "../../../../service/getService";
import { memo } from "react";
import "./ProductModal.scss";

const ProductModal = NiceModal.create(
  ({
    product,
    onSuccess,
  }: {
    product?: any;
    onSuccess: () => void;
  }) => {
    const modal = useModal();

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
      price: Yup.number().required("Required").positive("Must be positive"),
      image: Yup.string().url("Must be a valid URL").required("Required"),
      itemsAvailable: Yup.number().required("Required").min(0, "Cannot be negative"),
      category: Yup.string().required("Required"),
    });

    const categoryOptions = [
      { value: 'audio', label: 'Audio' },
      { value: 'wearables', label: 'Wearables' },
      { value: 'photography', label: 'Photography' },
      { value: 'computers', label: 'Computers' },
    ];

    const handleSubmit = async (values: any) => {
      try {
        const payload = {
          ...values,
          price: Number(values.price),
          itemsAvailable: Number(values.itemsAvailable),
          isPublished: String(values.isPublished) === "true",
        };

        if (product) {
          await updateProductApi(product.id, payload);
          alert("Product updated successfully");
        } else {
          await createProductApi(payload);
          alert("Product created successfully");
        }
        onSuccess();
        modal.hide();
      } catch (error) {
        console.error("Error saving product:", error);
        alert("Error saving product");
      }
    };

    return (
      <CommonModal
        className="product-modal"
        show={modal.visible}
        onHide={() => modal.hide()}
        heading={product ? "Edit Product" : "Add New Product"}
      >
        <div className="modal-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="product-form">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Product Name</label>
                    <FormControl name="name" placeholder="Enter product name" />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <FormControl control="textarea" name="description" placeholder="Enter product description" />
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <FormControl type="number" name="price" placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label>Available Items</label>
                    <FormControl type="number" name="itemsAvailable" placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <FormControl control="select" name="category" options={categoryOptions} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <FormControl control="select" name="isPublished" options={[
                      { value: true, label: 'Published' },
                      { value: false, label: 'Draft' }
                    ]} />
                  </div>
                  <div className="form-group full-width">
                    <label>Image URL</label>
                    <FormControl name="image" placeholder="https://example.com/image.jpg" />
                  </div>
                </div>

                <div className="form-actions">
                  <CommonButton
                    className="secondarybtn"
                    title="Cancel"
                    onClick={() => modal.hide()}
                    type="button"
                  />
                  <CommonButton
                    isLoading={isSubmitting}
                    title={product ? "Update Product" : "Create Product"}
                    type="submit"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </CommonModal>
    );
  }
);

export default memo(ProductModal);
