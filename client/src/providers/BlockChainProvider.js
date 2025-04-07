import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import VotingContract from "../contracts/Voting.json"; // Ensure correct path

export const BlockchainContext = createContext();

const BlockchainProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize Web3 and Contract
  const initWeb3 = async () => {
    console.log("Web3 initialization");
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        console.log("VotingContract.networks:", VotingContract.networks);
        const deployedNetwork = VotingContract.networks[networkId];
        console.log(Number(networkId));

        if (!deployedNetwork) {
          setErrorMessage("Smart contract not deployed on this network.");
          return;
        }

        const instance = new web3Instance.eth.Contract(
          VotingContract.abi,
          deployedNetwork.address
        );

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setContractInstance(instance);
      } catch (error) {
        console.error("Web3 Initialization Error:", error);
        setErrorMessage("Failed to connect to blockchain.");
      }
    } else {
      setErrorMessage("Please install MetaMask.");
    }
  };

  useEffect(() => {
    initWeb3(); // Call initWeb3 when provider mounts
  }, []);

  // Fetch Election Details
  // useEffect(() => {
  //     const fetchElectionDetails = async () => {
  //         try {
  //             if (!contractInstance) return;

  //             const details = await contractInstance.methods.electionDetails().call();
  //             setElectionName(details.electionName);
  //             setElectionDescription(details.description);
  //         } catch (error) {
  //             console.error("Error fetching election details:", error);
  //         }
  //     };

  //     if (contractInstance) {
  //         fetchElectionDetails();
  //     }
  // }, [contractInstance]);

  return (
    <BlockchainContext.Provider
      value={{
        web3,
        account,
        contractInstance,
        errorMessage,
        initWeb3,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainProvider;
