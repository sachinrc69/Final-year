import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

const ElectionDetailPage = () => {
    const location = useLocation();
    const election = location.state?.election;

    if (!election) {
        return <p>No election details available.</p>;
    }

    return (
        <div className="container">
            <h2>{election.electionName}</h2>
            <h4><strong>Description:</strong> {election.electionDescription}</h4>
            <br />
            <h3>Results</h3>
            <Row className="justify-content-center">
                {election.candidates.map((candidate, index) => (
                    <Col key={index} md={4} className="mb-3">
                        <Card className={election.winner && election.winner === candidate.name ? "bg-success text-white " : ""}>
                            <Card.Body>
                                <Card.Title>{candidate.name}</Card.Title>
                                <Card.Text >Votes: {candidate.votes}</Card.Text>
                                {election.winner && election.winner === candidate.name && <strong>🏆 Winner</strong>}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ElectionDetailPage;
