import React, { useState, useEffect } from "react";
import Web3 from "web3";
import VotingContract from "../../contracts/Voting.json";
import "../../styles/Verification.css";

const VerifyVoters = () => {
  const [message, setMessage] = useState({ type: "", text: "" });
  const [registeredVoters, setRegisteredVoters] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [ElectionInstance, setElectionInstance] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = VotingContract.networks[networkId];

          if (!deployedNetwork) {
            setMessage({ type: "danger", text: "Smart contract not deployed on this network." });
            return;
          }

          const instance = new web3.eth.Contract(VotingContract.abi, deployedNetwork.address);
          setWeb3(web3);
          setAccount(accounts[0]);
          setElectionInstance(instance);

          // Fetch voters from smart contract
          const voters = await instance.methods.getVoters().call();
          setRegisteredVoters(
            voters.map((voter) => ({
              address: voter.voterAddress,
              name: voter.name,
              aadhaar: voter.aadhaarHash, // Aadhaar is stored as a hash
              hasVoted: voter.hasVoted,
              isVerified: voter.isVerified,
              isRegistered: voter.isRegistered,
            }))
          );
        } catch (error) {
          console.error("Error initializing Web3:", error);
          setMessage({ type: "danger", text: "Failed to connect to blockchain." });
        }
      } else {
        setMessage({ type: "danger", text: "Please install MetaMask." });
      }
    };

    init();
    return () => {
      setElectionInstance(null); // Cleanup
    };
  }, []);

  const verifyVoter = async (voterAddress, verifiedStatus) => {
    if (!ElectionInstance || !account) {
      console.error("Election contract not initialized or account not found");
      return;
    }

    try {
      await ElectionInstance.methods.verifyVoter(voterAddress, verifiedStatus).send({
        from: account,
        gas: 1000000, // Adjust gas limit if needed
      });

      setRegisteredVoters((prev) =>
        prev.map((voter) =>
          voter.address === voterAddress ? { ...voter, isVerified: verifiedStatus } : voter
        )
      );

      setMessage({ type: "success", text: `Voter ${verifiedStatus ? "approved" : "rejected"} successfully!` });

      // Hide success message after 2 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2000);
    } catch (error) {
      console.error("Error verifying voter:", error);
      setMessage({ type: "danger", text: "Verification failed." });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Registered Voters</h2>
      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <ul className="list-group mb-4">
        {registeredVoters.filter(voter => !voter.isVerified).map((voter, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="text-dark">
              <strong>Name:</strong> {voter.name} <br />
              <strong>Address:</strong> {voter.address} <br />
              <strong>Aadhaar (Hashed):</strong> {voter.aadhaar} <br />
              <strong>Voted:</strong> {voter.hasVoted ? "Yes" : "No"} <br />
              <strong>Registered:</strong> {voter.isRegistered ? "Yes" : "No"}
            </div>
            <button className="btn btn-success" onClick={() => verifyVoter(voter.address, true)}>Approve</button>
          </li>
        ))}
      </ul>

      <h2 className="mb-4">Verified Voters</h2>
      <ul className="list-group mb-4">
        {registeredVoters.filter(voter => voter.isVerified).map((voter, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="text-dark">
              <strong>Name:</strong> {voter.name} <br />
              <strong>Address:</strong> {voter.address} <br />
              <strong>Aadhaar (Hashed):</strong> {voter.aadhaar} <br />
              <strong>Voted:</strong> {voter.hasVoted ? "Yes" : "No"} <br />
              <strong>Registered:</strong> {voter.isRegistered ? "Yes" : "No"}
            </div>
            <span className="badge bg-success">Verified</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerifyVoters;
