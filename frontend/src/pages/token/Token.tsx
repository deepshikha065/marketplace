import { Col, Row } from "react-bootstrap";
import CommonButton from "../../components/common/ui/commonButton/CommonButton";
import FormControl from "../../components/common/formik/FormControl";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/app/hooks";
import ContractABI from "../../contract/ContractABI.json";
import Web3 from "web3";

const Token = () => {
  const contractAddress = "0x3f85aE8A8c760D4c2cEfE6691452aC73d5a11929";

  const { account } = useAppSelector((state) => state.wallet);

  const [contract, setContract] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const initWeb3 = async () => {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const contractInstance = new web3Instance.eth.Contract(
          ContractABI,
          contractAddress
        );

        setContract(contractInstance);
        console.log("Web3 initialized");
      } catch (error) {
        console.error("Web3 init error:", error);
      }
    };

    initWeb3();
  }, []);

  const mintToken = async () => {
    if (!contract || !account) {
      alert("Wallet not connected");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);
      const amountWithDecimals = BigInt(amount) * BigInt(10 ** 18);
      await contract.methods
        .mint(account, amountWithDecimals.toString())
        .send({ from: account });
      console.log("Mint successful");
      alert("Tokens minted successfully!");
      setAmount("");
    } catch (error) {
      console.error("Minting error:", error);
      alert("Mint failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-5">Token Details</h2>
      <h6 className="mb-5">Metamask Address : {account}</h6>
      <Row>
        <Col lg={6}>
          <CommonButton
            className="primary_btn"
            title={loading ? "Processing..." : "Get Tokens"}
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
            onChange={(e: any) => setAmount(e.target.value)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Token;
