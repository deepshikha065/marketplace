import React from "react";
import { CartIcon } from "../../../assets/icons/svg";
import CommonButton from "../ui/commonButton/CommonButton";
import { useAppDispatch, useAppSelector } from "../../../redux/app/hooks";
import { addItemToCart, updateItemQuantity, removeItemFromCart } from "../../../features/cartSlice";
import QuantitySelector from "./ShowQty";

interface AddToCartBtnProps {
  productId: any;
  showQtySelector?: boolean;
}

const AddToCartBtn: React.FC<AddToCartBtnProps> = ({
  productId,
  showQtySelector = true,
}) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  // Check if item is already in cart
  const cartItem = items.find((item) => item.productId === productId);

  const handleAddToCart = () => {
    if (productId) {
      dispatch(addItemToCart({ productId, quantity: 1 }));
    }
  };

  const handleUpdateQty = (newQty: number) => {
    if (!cartItem) return;

    if (newQty === 0) {
      dispatch(removeItemFromCart(cartItem.id));
    } else {
      dispatch(updateItemQuantity({ itemId: cartItem.id, quantity: newQty }));
    }
  };

  if (cartItem && showQtySelector) {
    return (
      <QuantitySelector
        value={cartItem.quantity}
        min={0} // Allows removing from cart if qty reaches 0
        onChange={handleUpdateQty}
      />
    );
  }

  return (
    <CommonButton
      svgIcon={<CartIcon />}
      title="Add to Cart"
      className="small_btn add-to-cart-btn"
      onClick={handleAddToCart}
      fluid
    />
  );
};

export default AddToCartBtn;
