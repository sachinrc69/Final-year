import React, { useState, useEffect, useContext } from "react";
import { BlockchainContext } from "../../providers/BlockChainProvider";
import "../../styles/VotingArea.css";

const VotingArea = () => {
  const { web3, account: initialAccount, contractInstance } = useContext(BlockchainContext);
  const [account, setAccount] = useState(initialAccount);
  const [admin, setAdmin] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = account && admin && account.toLowerCase() === admin.toLowerCase();

  useEffect(() => {
    setAccount(initialAccount);
  }, [initialAccount]);

  useEffect(() => {
    const fetchElectionData = async () => {
      if (!contractInstance) return;

      try {
        const adminAddress = await contractInstance.methods.admin().call();
        setAdmin(adminAddress);

        const candidatesData = await contractInstance.methods.getCandidates().call();
        setCandidates(candidatesData.map(candidate => candidate.candidateName));

        if (account) {
          const voter = await contractInstance.methods.voterDetails(account).call();
          setHasVoted(voter.hasVoted);
          setIsVerified(voter.isVerified);
        }
      } catch (error) {
        setErrorMessage("Error loading data from the contract.");
        console.error(error);
      }
    };

    fetchElectionData();
  }, [contractInstance, account]);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountChange = (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
        setCandidates([]);
      };

      window.ethereum.on("accountsChanged", handleAccountChange);
      return () => window.ethereum.removeListener("accountsChanged", handleAccountChange);
    }
  }, []);

  const castVote = async () => {
    if (isAdmin) {
      setErrorMessage("Admins are not allowed to vote.");
      return;
    }

    if (!isVerified) {
      setErrorMessage("You are not verified by the admin.");
      return;
    }

    if (selectedCandidate === null) {
      setErrorMessage("Please select a candidate.");
      return;
    }

    if (account !== initialAccount) {
      setErrorMessage("You must use the registered MetaMask account to vote.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await contractInstance.methods.vote(selectedCandidate).send({ from: account });
      setHasVoted(true);
    } catch (error) {
      setErrorMessage("Error casting vote.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Voting DApp</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {account ? (
        <p>
          Connected Account: {account} {isAdmin && "(Admin)"}
        </p>
      ) : (
        <button onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}>
          Connect MetaMask
        </button>
      )}

      <div className="voting-section">
        <h2>Cast Your Vote</h2>
        {isAdmin ? (
          <p className="error-message">Admins are not allowed to vote.</p>
        ) : !isVerified ? (
          <p className="error-message">You are not verified by the admin.</p>
        ) : hasVoted ? (
          <p className="voted-message">Congrats!! You have successfully voted.</p>
        ) : (
          <div className="voting-subsection">
            {candidates.map((candidate, index) => (
              <div className="candidate" key={index}>
                <span>{candidate}</span>
                <label>
                  <input
                    type="radio"
                    name="candidate"
                    checked={selectedCandidate === index}
                    onChange={() => setSelectedCandidate(index)}
                  />
                </label>
              </div>
            ))}
          </div>
        )}
        <button onClick={castVote} disabled={isAdmin || !isVerified || hasVoted || selectedCandidate === null || isLoading}>
          {isLoading ? "Voting..." : "Vote"}
        </button>
      </div>
    </div>
  );
};

export default VotingArea;
