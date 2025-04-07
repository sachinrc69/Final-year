import React, { useState, useEffect } from "react";
import Web3 from "web3";
import VotingContract from "../../contracts/Voting.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
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

        // Fetch current phase
        const phase = await contractInstance.methods.getCurrentPhase().call();
        setCurrentPhase(phase);

        // Fetch election details
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

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setErrorMessage("");
        loadBlockchainData();
      } catch (error) {
        setErrorMessage("Connection to MetaMask was denied.");
      }
    } else {
      setErrorMessage(
        "MetaMask is not installed. Please install it to proceed."
      );
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      setErrorMessage("Please connect MetaMask before creating an election.");
      return;
    }
    try {
      await contract.methods
        .createElection(electionName, electionDescription)
        .send({ from: account });
      setSuccessMessage("Election created successfully!");
      setElectionCreated(true);

      // Fetch updated election details
      const election = await contract.methods.electionDetails().call();
      setElectionName(election.electionName);
      setElectionDescription(election.description);

      const phase = await contract.methods.getCurrentPhase().call();
      setCurrentPhase(phase);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to create election.");
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
      // Fetch the admin address from the contract
      const adminAddress = await contract.methods.admin().call();

      // Check if the connected account is the admin
      if (account.toLowerCase() !== adminAddress.toLowerCase()) {
        setErrorMessage("Only the election admin can change the phase.");
        return;
      }

      // Proceed with changing the phase
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
      console.log(electionData, "frontend");
      await axios.post(
        "http://localhost:5000/api/admin/storeElection",
        electionData
      );

      console.log("Election results successfully sent to backend.");
      toast.success("Election results successfully stored! 🎉");
    } catch (error) {
      console.error("Error sending election results:", error);
      toast.error("Failed to store election results. Please try again.");
    }
  };
  return (
    <div className="container">
      <h2>Manage Election</h2>

      {!account && (
        <div className="alert alert-warning">
          <p>{errorMessage || "Please connect to MetaMask to proceed."}</p>
          <button className="btn btn-warning" onClick={handleConnectWallet}>
            Connect MetaMask
          </button>
        </div>
      )}

      {account && (
        <>
          {!electionCreated ? (
            <form onSubmit={handleCreateElection}>
              <div className="form-group">
                <label htmlFor="electionName">Election Name:</label>
                <input
                  type="text"
                  id="electionName"
                  className="form-control"
                  value={electionName}
                  onChange={(e) => setElectionName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="electionDescription">
                  Election Description:
                </label>
                <textarea
                  id="electionDescription"
                  className="form-control"
                  value={electionDescription}
                  onChange={(e) => setElectionDescription(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Create Election
              </button>
            </form>
          ) : (
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

          {currentPhase === "Registration" && electionCreated && (
            <div className="alert alert-warning mt-3">
              Reminder: Please add a minimum of 2 candidates before starting the
              voting phase.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageElection;
