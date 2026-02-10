import { useNavigate } from "react-router-dom";
import { CartIcon } from "../../../assets/icons/svg";
import api from "../../../service/getService";
import CommonButton from "../ui/commonButton/CommonButton";
import { ROUTES } from "../../../constants/routes";

interface AddToCartBtnProps {
  productId: string;
  quantity?: number;
}

const AddToCartBtn: React.FC<AddToCartBtnProps> = ({
  productId,
  quantity = 1,
}) => {

  const navigate = useNavigate();

  const addToCart = async () => {
    try {
      const res = await api.post("/api/v1/cart/items", {
        productId,
        quantity,
      });
      console.log("Added to cart:", res.data);
      navigate(ROUTES.CART);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CommonButton
      svgIcon={<CartIcon />}
      title="Add to Cart"
      className="small_btn add-to-cart-btn"
      onClick={addToCart}
      fluid
    />
  );
};

export default AddToCartBtn;
