import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { BlockchainContext } from "../../providers/BlockChainProvider";

const Results = () => {
  const { contractInstance } = useContext(BlockchainContext); // Get smart contract instance
  const [loading, setLoading] = useState(true);
  const [electionStatus, setElectionStatus] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!contractInstance) {
        console.error("Smart contract not connected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // console.log("contractInstance", contractInstance.methods);
        const phase = await contractInstance.methods.getCurrentPhase().call();
        setElectionStatus(phase.toLowerCase()); // Normalize to lowercase

        // Fetch candidates and votes only if election is in result phase
        if (phase.toLowerCase() === "results") {
          const candidatesData = await contractInstance.methods.getCandidates().call();
          const formattedCandidates = candidatesData.map((candidate) => ({
            name: candidate.candidateName,
            votes: parseInt(candidate.voteCount),
          }));
          setCandidates(formattedCandidates);

          // Determine winner if candidates exist
          if (formattedCandidates.length > 0) {
            const maxVotes = Math.max(...formattedCandidates.map((c) => c.votes));
            setWinner(formattedCandidates.find((c) => c.votes === maxVotes));
          }
        }
      } catch (error) {
        console.error("Error fetching election results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults(); // Fetch results only once when component mounts
  }, [contractInstance]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading election results...</p>
      </Container>
    );
  }

  if (electionStatus === "election ended") {
    return (
      <Container className="text-center my-5">
        <h2>🏁 Election Ended 🏁</h2>
        <p>The election has officially ended. Thank you for participating!</p>
      </Container>
    );
  }

  if (electionStatus !== "results") {
    return (
      <Container className="text-center my-5">
        <p>Election is not yet completed. Please wait for results.</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Election Results</h2>
      <Row className="justify-content-center">
        {candidates.map((candidate, index) => (
          <Col key={index} md={4} className="mb-3">
            <Card className={winner && winner.name === candidate.name ? "bg-success text-white" : ""}>
              <Card.Body>
                <Card.Title>{candidate.name}</Card.Title>
                <Card.Text>Votes: {candidate.votes}</Card.Text>
                {winner && winner.name === candidate.name && <strong>🏆 Winner</strong>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Results;
