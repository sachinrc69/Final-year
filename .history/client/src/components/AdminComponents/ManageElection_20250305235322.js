import React, { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";
import VotingContract from "../../contracts/Voting.json";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const ManageElection = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [electionName, setElectionName] = useState("");
  const [electionDescription, setElectionDescription] = useState("");
  const [currentPhase, setCurrentPhase] = useState("");
  const [electionCreated, setElectionCreated] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();

        if (accounts.length === 0) {
          setErrorMessage(
            "MetaMask is installed but not connected. Please connect your wallet."
          );
          return;
        }

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];

        if (!deployedNetwork) {
          setErrorMessage(
            "Smart contract not deployed on the selected network. Please switch networks."
          );
          return;
        }

        const contractInstance = new web3Instance.eth.Contract(
          VotingContract.abi,
          deployedNetwork.address
        );

        setWeb3(web3Instance);
        setContract(contractInstance);
        setAccount(accounts[0]);

        const phase = await contractInstance.methods.getCurrentPhase().call();
        setCurrentPhase(phase);

        const election = await contractInstance.methods
          .electionDetails()
          .call();
        if (election.electionName) {
          setElectionName(election.electionName);
          setElectionDescription(election.description);
          setElectionCreated(true);
        }
      } catch (error) {
        setErrorMessage("Error loading blockchain data. Please try again.");
        console.error(error);
      }
    } else {
      setErrorMessage(
        "MetaMask is not installed. Please install MetaMask to use this DApp."
      );
    }
  };

  const handleChangePhase = async () => {
    if (!contract || !account) {
      setErrorMessage(
        "Please connect MetaMask before changing the election phase."
      );
      return;
    }

    try {
      const adminAddress = await contract.methods.admin().call();

      if (account.toLowerCase() !== adminAddress.toLowerCase()) {
        setErrorMessage("Only the election admin can change the phase.");
        return;
      }

      await contract.methods.changePhase().send({ from: account });
      const newPhase = await contract.methods.getCurrentPhase().call();
      setCurrentPhase(newPhase);
      setSuccessMessage(`Election phase changed to ${newPhase}`);

      if (newPhase === "Election Ended") {
        await sendElectionResultsToBackend();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to change phase.");
    }
  };

  const sendElectionResultsToBackend = async () => {
    try {
      console.log("Fetching election details...");

      const electionDetails = await contract.methods.electionDetails().call();
      const candidatesData = await contract.methods.getCandidates().call();

      const formattedCandidates = candidatesData.map((c) => ({
        name: c.candidateName,
        votes: parseInt(c.voteCount),
      }));

      const maxVotes = Math.max(...formattedCandidates.map((c) => c.votes));
      const winner =
        formattedCandidates.find((c) => c.votes === maxVotes)?.name ||
        "No winner";

      const electionData = {
        electionName: electionDetails[0],
        electionDescription: electionDetails[1],
        winner,
        candidates: formattedCandidates,
      };
      console.log(electionData);
      await axios.post(
        "http://localhost:5000/api/admin/storeElection",
        electionData
      );

      console.log("Election results successfully sent to backend.");
      toast.success("Election results successfully stored! 🎉"); // Show success toast
    } catch (error) {
      console.error("Error sending election results:", error);
      toast.error("Failed to store election results. Please try again.");
    }
  };

  return (
    <div className="container">
      <ToastContainer /> {/* Toast container for notifications */}
      <h2>Manage Election</h2>
      {!account && (
        <div className="alert alert-warning">
          <p>{errorMessage || "Please connect to MetaMask to proceed."}</p>
          <button
            className="btn btn-warning"
            onClick={() =>
              window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then(loadBlockchainData)
            }
          >
            Connect MetaMask
          </button>
        </div>
      )}
      {account && (
        <>
          {electionCreated && (
            <div className="mt-4">
              <h3>Election Details</h3>
              <p>
                <strong>Name:</strong> {electionName}
              </p>
              <p>
                <strong>Description:</strong> {electionDescription}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success mt-3">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="alert alert-danger mt-3">{errorMessage}</div>
          )}

          {electionCreated && (
            <div className="mt-5">
              <h3>Current Phase: {currentPhase}</h3>
              {currentPhase !== "Election Ended" && (
                <button
                  className="btn btn-secondary mt-3"
                  onClick={handleChangePhase}
                >
                  {currentPhase === "Registration" && "Start Voting Phase"}
                  {currentPhase === "Voting" && "Start Results Phase"}
                  {currentPhase === "Results" && "End Election"}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageElection;
