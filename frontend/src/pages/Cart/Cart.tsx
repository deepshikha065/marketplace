import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, LogoutIcon } from "../../assets/icons/svg";
import CommonButton from "../../components/common/ui/commonButton/CommonButton";
import { ROUTES } from "../../constants/routes";
import "./Cart.scss";
import ContractABI from "../../contract/ContractABI.json";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import toast from "react-hot-toast";
import QuantitySelector from "../../components/common/addToCartBtn/ShowQty";
import { updateItemQuantity, removeItemFromCart, fetchCart } from "../../features/cartSlice";
import api from "../../service/getService";
import { CHECKOUTAPI } from "../../../constant";
import { useWriteContract, useSwitchChain, useAccount } from "wagmi";
import { parseEther } from "viem";


const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItems, status } = useAppSelector((state) => state.cart);
  const { address, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { switchChain } = useSwitchChain();

  const TARGET_CHAIN_ID = 97;

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateItemQuantity({ itemId, quantity: newQuantity }));

  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItemFromCart(itemId));
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price =
        typeof item.product?.price === "string"
          ? parseFloat(item.product.price.replace("$", ""))
          : item.product?.price || 0;

      return acc + (Number(price) * item.quantity);
    }, 0);
  }, [cartItems]);

  const shipping = subtotal > 0 ? 1 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) return;

      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      await api.post(CHECKOUTAPI, payload);
      toast.success("Checkout successful!");
      dispatch(fetchCart());
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  const contractAddress = "0x3f85aE8A8c760D4c2cEfE6691452aC73d5a11929";
  const merchantAddress = "0x89D3292830107e6abd5b613be1BE80463A091C3D";


  // const handleCryptoCheckout = async () => {
  //   if (!address) {
  //     toast.error("Please Connect wallet");
  //     return;
  //   }

  //   try {
  //     const contract = new web3.eth.Contract(
  //       ContractABI as any,
  //       contractAddress
  //     );

  //     const amountWithDecimals = BigInt(
  //       web3.utils.toWei(total.toString(), "ether")
  //     );

  //     const tx = await contract.methods
  //       .transfer(merchantAddress, amountWithDecimals.toString())
  //       .send({ from: contextAccount });

  //     await api.post(CHECKOUTAPI, {
  //       txHash: tx.transactionHash,
  //       amount: total,
  //     });
  //     toast.success("Payment successful!");
  //     dispatch(fetchCart());
  //   } catch (error) {
  //     console.error("Crypto payment failed:", error);
  //     toast.error("Payment failed");
  //   }
  // };
  const handleCryptoCheckout = async () => {
    if (!address) {
      toast.error("Please connect wallet");
      return;
    }

    try {

      if (chainId !== TARGET_CHAIN_ID) {
        await switchChain({ chainId: TARGET_CHAIN_ID });
      }

      const amountInWei = parseEther(total.toString());

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: ContractABI,
        functionName: "transfer",
        args: [merchantAddress, amountInWei],
        chainId: TARGET_CHAIN_ID,
      });

      await api.post(CHECKOUTAPI, {
        txHash: hash,
        amount: total,
      });

      toast.success("Payment successful!");
      dispatch(fetchCart());
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    }
  };
  if (status === 'loading' && cartItems.length === 0) {
    return <div className="cart-page"><p>Loading cart...</p></div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button
          onClick={() => navigate(ROUTES.MARKETPLACE)}
          className="back-btn"
        >
          <ArrowLeftIcon /> Continue Shopping
        </button>
        <h2>My Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <CommonButton
            title="Shop Now"
            onClick={() => navigate(ROUTES.MARKETPLACE)}
          />
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-section">
            <div className="items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-info">
                      <h3>{item.product?.name}</h3>
                      <p className="category">
                        Category: {item.product?.category}
                      </p>
                    </div>

                    <div className="item-quantity">
                      <span className="qty-label">Quantity:</span>
                      <QuantitySelector
                        value={item.quantity}
                        min={1}
                        onChange={(newQty) =>
                          handleUpdateQuantity(item.id, newQty)
                        }
                      />
                    </div>
                  </div>
                  <div className="item-price-actions">
                    <span className="item-price">
                      $
                      {(
                        (typeof item.product?.price === "string"
                          ? parseFloat(
                            item.product.price.replace("$", "")
                          )
                          : item.product?.price || 0) * item.quantity
                      ).toFixed(2)}
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <LogoutIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <CommonButton
                title="Proceed to Checkout"
                fluid
                className="checkout-btn"
                onClick={handleCheckout}
              />
              <CommonButton
                title="Pay with Crypto"
                fluid
                className="checkout-btn mt-4"
                onClick={handleCryptoCheckout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
