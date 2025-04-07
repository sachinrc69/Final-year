import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CandidateCard from './CandidateCard';
import '../../styles/AddCandidates.css';
import { Modal, Button } from 'react-bootstrap';
import VotingContract from '../../contracts/Voting.json';

const AddCandidates = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = VotingContract.networks[networkId];

          if (deployedNetwork) {
            const contractInstance = new web3Instance.eth.Contract(
              VotingContract.abi,
              deployedNetwork.address
            );

            setWeb3(web3Instance);
            setContract(contractInstance);
            setAccount(accounts[0]);

            // Fetch existing candidates
            const candidateCount = await contractInstance.methods.candidateCount().call();
            const fetchedCandidates = [];
            for (let i = 0; i < candidateCount; i++) {
              const candidate = await contractInstance.methods.candidateDetails(i).call();
              fetchedCandidates.push({
                name: candidate.candidateName,
                description: candidate.description,
                votes: candidate.voteCount,
              });
            }
            setCandidates(fetchedCandidates);
          } else {
            console.error('Contract not deployed on the current network');
          }
        } catch (error) {
          console.error('Error connecting to Web3:', error);
        }
      } else {
        console.error('Ethereum wallet not detected');
      }
    };

    initWeb3();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      console.error('Smart contract not loaded');
      return;
    }

    try {
      await contract.methods.addCandidate(name, description).send({ from: account });
      setSuccessMessage('Candidate added successfully!');
      setCandidates([...candidates, { name, description, votes: 0 }]);
      setShowForm(false);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  };

  return (
    <div className="container">
      <h2>Candidate Details</h2>
      <div className="row">
        {candidates.map((candidate, index) => (
          <div key={index} className="col-md-4 mb-4">
            <CandidateCard candidate={candidate} />
          </div>
        ))}
      </div>
      <Button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>Add Candidate</Button>
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Candidate Name:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="btn btn-primary mt-3">Add Candidate</Button>
          </form>
        </Modal.Body>
      </Modal>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
    </div>
  );
};

export default AddCandidates;
