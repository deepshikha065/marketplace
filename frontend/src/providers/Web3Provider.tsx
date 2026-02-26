// import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
// import Web3 from "web3";
// import { useAppDispatch } from "../redux/app/hooks";
// import { setAccount as setReduxAccount } from "../features/WalletSlice";

// interface Web3ContextType {
//   web3: Web3 | null;
//   account: string | null;
//   chainId: number | null;
//   connectWallet: () => Promise<void>;
//   disconnectWallet: () => void;
//   isCorrectNetwork: boolean;
//   switchNetwork: (targetChainId: string) => Promise<void>;
// }

// const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// export const useWeb3 = () => {
//   const context = useContext(Web3Context);
//   if (context === undefined) {
//     throw new Error("useWeb3 must be used within a Web3Provider");
//   }
//   return context;
// };

// interface Web3ProviderProps {
//   children: ReactNode;
// }

// export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
//   const [web3, setWeb3] = useState<Web3 | null>(null);
//   const [account, setAccount] = useState<string | null>(null);
//   const [chainId, setChainId] = useState<number | null>(null);
//   const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(true);
  
//   const DEFAULT_CHAIN_ID = "0x61";

//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (window.ethereum) {
//       const web3Instance = new Web3(window.ethereum as any);
//       setWeb3(web3Instance);

//       const init = async () => {
//         const accounts = await web3Instance.eth.getAccounts();
//         if (accounts.length > 0) {
//           setAccount(accounts[0]);
//           dispatch(setReduxAccount(accounts[0]));
//         }

//         const currentChainId = await web3Instance.eth.getChainId();
//         setChainId(Number(currentChainId));
//         setIsCorrectNetwork(currentChainId.toString() === BigInt(DEFAULT_CHAIN_ID).toString());
//       };

//       init();
//       (window.ethereum as any).on("accountsChanged", (accounts: string[]) => {
//         const acc = accounts.length > 0 ? accounts[0] : null;
//         setAccount(acc);
//         dispatch(setReduxAccount(acc));
//       });


//       (window.ethereum as any).on("chainChanged", (hexChainId: string) => {
//         setChainId(parseInt(hexChainId, 16));
//         setIsCorrectNetwork(hexChainId.toLowerCase() === DEFAULT_CHAIN_ID.toLowerCase());

//       });
//     }
//   }, []);

//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       throw new Error("MetaMask is not installed");
//     }
//     try {
//       const accounts = await (window.ethereum as any).request({
//         method: "eth_requestAccounts",
//       });
//       setAccount(accounts[0]);
//     } catch (error) {
//       console.error("User rejected connection:", error);
//       throw error;
//     }
//   };

//   const disconnectWallet = () => {
//     setAccount(null);
//   };

//   const switchNetwork = async (targetChainId: string) => {
//     if (!window.ethereum) return;
//     try {
//       await (window.ethereum as any).request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: targetChainId }],
//       });
//     } catch (switchError: any) {
    
//       if (switchError.code === 4902) {
      
//         console.error("Chain not added to MetaMask");
//       }
//       console.error("Failed to switch network:", switchError);
//     }
//   };

//   return (
//     <Web3Context.Provider
//       value={{
//         web3,
//         account,
//         chainId,
//         connectWallet,
//         disconnectWallet,
//         isCorrectNetwork,
//         switchNetwork,
//       }}
//     >
//       {children}
//     </Web3Context.Provider>
//   );
// };
