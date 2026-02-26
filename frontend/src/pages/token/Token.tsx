import { Col, Row } from "react-bootstrap";
import CommonButton from "../../components/common/ui/commonButton/CommonButton";
import FormControl from "../../components/common/formik/FormControl";
import { useState } from "react";
import ContractABI from "../../contract/ContractABI.json";
import toast from "react-hot-toast";
import { 
  useAccount, 
  useReadContract, 
  useWriteContract,
  useSwitchChain 
} from "wagmi";

import { parseEther, formatEther } from "viem";

const contractAddress = "0x3f85aE8A8c760D4c2cEfE6691452aC73d5a11929";

const Token = () => {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const TARGET_CHAIN_ID = 97;

  const { data: balance, refetch } = useReadContract({
    address: contractAddress,
    abi: ContractABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: TARGET_CHAIN_ID,
  });

  const formattedBalance = balance
    ? Number(formatEther(balance as bigint)).toFixed(2)
    : "0";

  const mintToken = async () => {
    if (!address) {
      toast.error("Please connect wallet");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    try {
      setLoading(true);
      if (chainId !== TARGET_CHAIN_ID) {
        await switchChain({ chainId: TARGET_CHAIN_ID });
      }

      await writeContractAsync({
        address: contractAddress,
        abi: ContractABI,
        functionName: "mint",
        args: [address, parseEther(amount)],
        chainId: TARGET_CHAIN_ID,
      });

      toast.success("Tokens minted successfully!");
      setAmount("");
      refetch(); 
    } catch (error) {
      console.error(error);
      toast.error("Mint failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-5">Token Details</h2>
      <h6 className="mb-3">Metamask Address: {address}</h6>

      <h4 className="mb-4">
        Total Tokens in Wallet:
        <strong> {formattedBalance}</strong>
      </h4>

      <Row>
        <Col lg={6}>
          <CommonButton
            className="primary_btn"
            title={loading ? "Processing..." : "Mint Tokens"}
            fluid
            onClick={mintToken}
            disabled={loading}
          />
        </Col>

        <Col lg={6}>
          <FormControl
            placeholder="Enter Amount"
            name="amount"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value)
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default Token;