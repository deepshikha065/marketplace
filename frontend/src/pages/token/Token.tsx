import { Col, Row } from "react-bootstrap";
import CommonButton from "../../components/common/ui/commonButton/CommonButton";
import FormControl from "../../components/common/formik/FormControl";
import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../redux/app/hooks";
import ContractABI from "../../contract/ContractABI.json";
import Web3 from "web3";
import toast from "react-hot-toast";

const Token = () => {
  const contractAddress = "0x3f85aE8A8c760D4c2cEfE6691452aC73d5a11929";

  const { account } = useAppSelector((state) => state.wallet);
  const [contract, setContract] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const initWeb3 = async () => {
      try {
        await (window.ethereum as any).request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x61" }], // 97 in hex
        });
        const web3Instance = new Web3(window.ethereum as any);
        console.log("WEb 3 instance", web3Instance);
        console.log("chan id ", await web3Instance.eth.getChainId());
        const contractInstance = new web3Instance.eth.Contract(
          ContractABI,
          contractAddress
        );

        console.log("Contract Code:", contractInstance);

        setContract(contractInstance);
      } catch (error) {
        console.error("Web3 init error:", error);
      }
    };
    initWeb3();
  }, []);


  const fetchBalance = useCallback(async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      const rawBalance = await contract.methods.balanceOf(account).call();
      const formattedBalance = Web3.utils.fromWei(rawBalance, "ether");
      setBalance(Number(formattedBalance).toFixed(2));
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
    finally {
      setLoading(false);
    }
  }, [contract, account]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const mintToken = async () => {
    if (!contract || !account) {
      toast.error("Please connect with MetaMask");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    try {
      setLoading(true);
      const amountWithDecimals = Web3.utils.toWei(amount, "ether");

      await contract.methods
        .mint(account, amountWithDecimals)
        .send({ from: account });

      toast.success("Tozlkens minted successfully!");
      setAmount("");

      fetchBalance();
    } catch (error) {
      console.error("Minting error:", error);
      toast.error("Mint failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-5">Token Details</h2>
      <h6 className="mb-3">Metamask Address: {account}</h6>

      <h4 className="mb-4">
        Total Tokens in Wallet: <strong>{loading ? "Loading..." : balance || "0"}</strong>
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