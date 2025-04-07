
import Web3 from "web3";
import VotingContract from "./contracts/Voting.json"; // Make sure Voting.json is in src/contracts/

const deployContract = async (candidates) => {
  try {
    // Connect to Ethereum
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Get the current account (Admin)
    const accounts = await web3.eth.getAccounts();

    // Get network ID and deploy contract
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = VotingContract.networks[networkId];

    const contract = new web3.eth.Contract(VotingContract.abi);

    // Deploy contract with candidates
    const deployedContract = await contract
      .deploy({ data: VotingContract.bytecode, arguments: [candidates] })
      .send({ from: accounts[0] });

    console.log("Contract deployed at:", deployedContract.options.address);

    return deployedContract;
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
};

export default deployContract;
